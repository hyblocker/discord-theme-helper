const { Plugin } = require('powercord/entities');
const { inject, uninject } = require('powercord/injector');
const { findInReactTree } = require('powercord/util');
const { React, getModule } = require('powercord/webpack');

// list of elements which we whitelist giving the mouse position to
const rippleElements = [
	'message-2qnXI6',
	'container-2Pjhx-',
	'containerDefault--pIXnN',
	'labelContainer-1BLJti',
	'item-PXvHYJ',
	'channel-2QD9_O',
	'content-1x5b-n',
	'listRow-hutiT_',
	'resultFocused-3aIoYe',
	'item-2J2GlB',
	'actionButton-VzECiy',
	'autocompleteRowVertical-q1K4ky',
];

let _this = {};

module.exports = class HyblockerThemeHelper extends Plugin {
	constructor(...args) {
		super(...args);
		this.mouseEventBind = this.mouseEventBind.bind(this)
		_this = this;
		_this.userCache = {};
	}
	
	async startPlugin() {
		
		document.body.addEventListener("mousemove", this.mouseEventBind("mouse"));
        document.body.addEventListener("mousedown", this.mouseEventBind("click"));

		const friendRow = await getModule(m => m.displayName === 'PeopleListItem', false).prototype;
		_this.getPrimaryColorForAvatar = await getModule(["getPrimaryColorForAvatar"]);
		
		// Inject CSS into the friends row, exposing banners and accent colors
		inject(
			"theme-helper-friendRowPatch",
			friendRow,
			"render",
			this.friendRowPatch
		);
	}

	pluginWillUnload() {
		
		document.body.removeEventListener("mousemove", this.mouseEventBind("mouse"));
		document.body.removeEventListener("mousedown", this.mouseEventBind("click"));
		
		powercord.api.settings.unregisterSettings(this.entityID);
		
		uninject("theme-helper-friendRowPatch");
	}

	mouseEventBind(param) {
		return function (e) {
			// Get the element
			e = e || window.event;
			let target = e.target || e.srcElement;
			let foundTarget = false;

			for (let j = 0; j < rippleElements.length; j++)
			{
				if (target.classList.contains(rippleElements[j])) {
					foundTarget = true;
					break;
				}
			}

			// Check up to 5 parents up if the element has an after
			for (let i = 0; i < 4 && !foundTarget; i++) {
				if (target.parentElement != null) {
					target = target.parentElement;
					for (let j = 0; j < rippleElements.length && !foundTarget; j++) {
						if (target.classList.contains(rippleElements[j]))
							foundTarget = true;
					}
				}
			}

			if (foundTarget) {
				// Get the mouse position relative to the element
				const rect = target.getBoundingClientRect();
				let x = e.clientX - rect.left; //x position within the element.
				let y = e.clientY - rect.top;  //y position within the element.
				x -= rect.width / 2;
				y -= rect.height / 2;

				// Tell the CSS
				target.style.setProperty("--" + param + "X", x + "px");
				target.style.setProperty("--" + param + "Y", y + "px");
			}
		}
	}

	friendRowPatch(_, res) {

		const items = res.props.children();
		const userObj = findInReactTree(items, e=> e && e.user)?.user;
		const userData = _this.fetchUser(userObj.id);

		let accentColor = null;
		if (userObj.accentColor)  {
			accentColor = userObj.accentColor;
			_this.cacheUser(userObj);
		} else if (userData.accentColor) {
			// fallback to accent if possible
			accentColor = userData.accentColor;
		}
		else {
			// fallback to autogen
			_this.getPrimaryColorForAvatar.getPrimaryColorForAvatar(userObj.getAvatarURL())
				.then(args => _this.cacheUser(userObj, { accentColorGenerated: args }));
			
			accentColor = userData.autoAccent;
		}
		
		accentColor = _this._numberToRgba(accentColor);
		
		// Add the attributes
		const modified = React.cloneElement(items.props.children, {
			// return discord props which get lost during injection
			'role': "listitem",
			'data-list-item-id': `people-list___${userObj.id}`,
			'tabindex': -1,

			// inject additional props
			'data-user-id': userObj.id,
			'data-banner-url': userData.bannerURL,
			'data-accent-color': accentColor,

			// style
			style: {
				"--user-banner": userData.bannerURL ? `url("${userData.bannerURL}")` : null,
				"--user-accent-color": accentColor,
				...items.props.children.props.style
			}
		});

		res.props.children = function() { return modified };

		return res;
	}

	// Stolen from https://github.com/powercord-community/rolecolor-everywhere/blob/master/index.js#L388-L394
	_numberToRgba (color, alpha = 1) {
		const { r, g, b } = _this._numberToRgb(color);
		if (alpha === 1) {
		  return `rgb(${r}, ${g}, ${b})`;
		}
		return `rgba(${r}, ${g}, ${b}, ${alpha})`;
	}

	_numberToRgb (color) {
		const r = (color & 0xFF0000) >>> 16;
		const g = (color & 0xFF00) >>> 8;
		const b = color & 0xFF;
		return {
			r,
			g,
			b
		};
	}

	_rgbToNumber (rgb) {
		return (((rgb[0] << 8) + rgb[1]) << 8) + rgb[2];
	}

	cacheUser(user, props) {
		let savedUser = null;
		let shouldSave = false;
		let intEncodedColor = null;

		// Fill props
		if (props?.accentColorGenerated) intEncodedColor = _this._rgbToNumber(props.accentColorGenerated);

		// Fetch user, so that we update it (and not overwrite)
		if (_this.userCache[user.id]) {
			savedUser = _this.userCache[user.id];
		} else {
		 	savedUser = _this.settings.get(user.id, {
		 		bannerURL: null,
		 		accentColor: null,
		 		autoAccent: null,
		 	});
		}

		// Check for a diff if the user was saved
		if (!(user.bannerURL == null && user.accentColor == null) && user.bannerURL != savedUser.bannerURL) {
			savedUser.bannerURL = user.bannerURL;
			shouldSave = true;
		}
		if (user.accentColor && user.accentColor != savedUser.accentColor) {
			savedUser.accentColor = user.accentColor;
			shouldSave = true;
		}
		if (props?.accentColorGenerated && intEncodedColor != savedUser.autoAccent) {
			savedUser.autoAccent = intEncodedColor;
			shouldSave = true;
		}

		if (shouldSave) {
			_this.settings.set(user.id, savedUser);
			_this.userCache[user.id] = savedUser;
			console.log("[Hyblocker's Theme Helper]", `Cached user "${user.username}#${user.discriminator}"!`);
		}
	}
	
	fetchUser(userId) {
		if (_this.userCache[userId]) {
			return _this.userCache[userId];
		} else {
			_this.userCache[userId] = _this.settings.get(userId, {
				bannerURL: null,
				accentColor: null,
				autoAccent: null,
			});
			return _this.userCache[userId];
		}
	}
};

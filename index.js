const { Plugin } = require('powercord/entities');
const { inject, uninject } = require('powercord/injector');
const { React, getModule } = require('powercord/webpack');

const { Button } = require('powercord/components');

const { FormTitle } = getModule(["FormTitle"], false);
const flexClasses = getModule(["flex", "directionRow"], false);
const marginClasses = getModule(["marginBottom20"], false);

// Track if cumcord was injected before
let hasCummed = false;
let failedToInject = false;

module.exports = class HyblockerThemeHelper extends Plugin {

	async startPlugin() {

		if (typeof eval == undefined || typeof eval == null) {
			console.error("[CRITICAL] eval is undefined! Cumcord cannot work without eval!");
			this.fuckV3();
			return;
		}

		try {

			// cum on your cord :)
			if (!window.cumcord) {
				const response = await fetch("https://cors.bridged.cc/https://hg.sr.ht/~creatable/Cumcord/raw/dist/build.js?rev=stable");
				const text = await response.text();
				eval(text);
				if (window.cumcord) {
					hasCummed = true;
				} else {
					console.error("[CRITICAL] Failed to inject cumcord!");
					this.fuckV3();
					return;
				}
			}

			// Import Theme Helper!!!!!!!!
			window.cumcord.plugins.importPlugin("https://hyblocker-discord.github.io/cumcord-plugins/ThemeHelper/dist/");

			console.log(`Loaded ${this.manifest.name}`);
		} catch (ex) {
			console.error(ex);
			this.fuckV3();
		}
	}

	pluginWillUnload() {
		if (failedToInject) {
			uninject(`${this.manifest.name}-cumcordFailsafe`);
		} else {
			console.log("Unloaded!");
			if (hasCummed) {
				cumcord.uninject();
			}
		}
	}

	fuckV3() {
			failedToInject = true;

			// fuk u v3!!!!!
			const SettingsPage = this.buildSettingsPage();
			const Settings = await getModule(m => m.displayName == "SettingsView");

			// Inject fake Cumcord tab :troll:
			inject(
				`${this.manifest.name}-cumcordFailsafe`,
				Settings.prototype,
				"getPredicateSections",
				(args, items) => {
					const position = items.findIndex((item) => { return item.section == "changelog" }) - 1;

					// Check if we're in the user settings menu
					if (position < 0) return items;

					const pluginSettings = [
						{ section: "DIVIDER" },
						{ section: "HEADER", label: "Cumcord" },
						{ section: "CUMCORD_PLUGINS", label: "Plugins", element: SettingsPage },
					];

					items.splice(position, 0, ...pluginSettings)

					return items;
				},
				false
			);
	}

	buildSettingsPage() {
		return class SettingsPage extends React.PureComponent {
			constructor(props) {
				super(props);
			}

			render() {

				return (
					React.createElement('div', { className: "cumcord" },
						React.createElement(FormTitle, { tag: 'h1', style: {'margin-bottom': '8px', 'margin': 'auto', 'font-weight': '700', 'font-size': '1.4rem'}}, "Fuck powerCord v3"),
						React.createElement('a', { href: "https://docs.cumcord.com/#/apocalypse/", target:"_blank", ref:"noreferrer noopener", className: "lonk", style: {'margin-bottom': '8px'} }, "powercord fucking broke all my ploogins"),
						React.createElement(FormTitle, { tag: 'h2', style: {'margin-bottom': '8px', 'font-size': '2rem', 'line-height': '3rem'}}, "All hail the cumcord national anthem"),
						// React.createElement('video', { src: 'https://cdn.discordapp.com/attachments/824921608560181261/891108729062293524/CCP.mp4', className: 'crazy-cum-party', autoplay: true, }),
						React.createElement("iframe", {
							width: "560",
							height: "315",
							src: "https://www.youtube-nocookie.com/embed/OjNpRbNdR7E?controls=0",
							title: "YouTube video player",
							frameborder: "0",
							allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
							allowfullscreen: true
						})
					));
			}
		}
	}
};

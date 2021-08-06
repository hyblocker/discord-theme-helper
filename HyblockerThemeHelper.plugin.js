/**
 * @name HyblockerThemeHelper
 * @author Hyblocker
 * @description Allows Themes to do things which require Javascript such as proper ripple and rendering the cursor as a light
 * @version 1.0.0
 * @source https://gist.github.com/rauenzi/e5f4d02fc3085a53872b0236cd6f8225
 */

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

module.exports = class PixelCordHelper {
    constructor() {
        this.mouseEventBind = this.mouseEventBind.bind(this)
    }

    load() {
        document.body.addEventListener("mousemove", this.mouseEventBind("mouse"));
        document.body.addEventListener("mousedown", this.mouseEventBind("click"));
    }

    start() {}
    
    stop() {
        document.body.removeEventListener("mousemove", this.mouseEventBind("mouse"));
        document.body.removeEventListener("mousedown", this.mouseEventBind("click"));
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
}
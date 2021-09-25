const { Plugin } = require('powercord/entities');
const { inject, uninject } = require('powercord/injector');
const { React, getModule } = require('powercord/webpack');

// Track if cumcord was injected before
let hasCummed = false;
let settingsPatch;

module.exports = class HyblockerThemeHelper extends Plugin {

    async startPlugin() {
        // Don't inject if cumcord was already injected
        if (!window.cumcord) {
            // cum on your cord :)
            const response = await fetch("https://cdn.jsdelivr.net/gh/Cumcord/Cumcord@stable/dist/build.js");
            const text = await response.text();
            eval(`${text}
            //# sourceURL=https://cdn.jsdelivr.net/gh/Cumcord/Cumcord@stable/dist/build.js`);

            if (window.cumcord) {
                hasCummed = true;

                // Import Theme Helper
                window.cumcord.plugins.importPlugin("https://hyblocker-discord.github.io/cumcord-plugins/ThemeHelper/dist/");

                // Check if cumcord was ever injected via a wrapper
                // TODO: Some global settings API rather than PC-Settings API, probably using nests, but idk how nests works so its a TODO
                if (this.settings.get("CUMCORD_FIRST_TIME", true)) {

                    // Show the modal whenever the user enters settings the first time
                    const Settings = window.cumcord.modules.webpack.findByDisplayName("SettingsView");
                    settingsPatch = window.cumcord.patcher.after("render", Settings.prototype, (args, res) => {

                        // Check if we're in the user settings menu
                        const sidebarItems = res.props.sidebar.props.children;
                        const position = sidebarItems.findIndex((item) => { return item.key == "changelog" }) - 1;
                        if (position < 0) return res;

                        if (this.settings.get("CUMCORD_FIRST_TIME", true)) {

                            // Show the modal informing the user about what cumcord is, so that they aren't alarmed
                            window.cumcord.ui.modals.showConfirmationModal(
                                {
                                    header: "It seems that this is your first time using a Cumcord plugin!",
                                    content: `Hey, it looks like you've installed a Cumcord plugin via ${this.manifest.name}. Cumcord is a plugin that allows developers to write plugins that work on every mod. As such, you'll notice that you now have a "Cumcord" area in your Discord settings. Don't be alarmed, this page exists to configure the plugins you use that depend on Cumcord.`,
                                    confirmText: "OK",
                                    cancelText: null,
                                    type: "confirm"
                                }
                            ).then();

                            // Don't show the modal ever again
                            this.settings.set("CUMCORD_FIRST_TIME", false);
                        }

                        return res;
                    });
                }

                console.log(`Loaded ${this.manifest.name}`);
            }
        }
    }

    pluginWillUnload() {
        console.log("Unloaded!");
        if (hasCummed) {
            // Uninject modal patch
            if (settingsPatch) {
                settingsPatch();
            }
            // Uninject cumcord itself
            cumcord.uninject();
        }
    }
};

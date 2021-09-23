# Hyblocker's Theme Helper

A simple plugin which exposes a few things to CSS so that themes can do cool stuff they couldn't do before.

That's literally it; its nothing special because it doesn't have to be :D

## Installation

## Powercord

Clone to plugins directory using

```bash
git clone https://github.com/hyblocker/discord-theme-helper.git
```

## BetterDiscord

**Recommended:** download the alternative version [from here](https://raw.githubusercontent.com/hyblocker-discord/cumcord-plugins/main/Wrappers/ThemeHelper/ThemeHelper.plugin.js)

Download the `HyblockerThemeHelper.plugin.js` file and drop it into your plugins folder. (Will be deprecated in favour of the above version soon™)

## Cumcord
Add `https://hyblocker-discord.github.io/cumcord-plugins/ThemeHelper/dist/`

## Feature parity
| Feature | Powercord | BetterDiscord | Cumcord |
| ------- | --------- | ------------- | ------- |
| mouse position | ✔ | ✔ | ✔ |
| mouse click position | ✔ | ✔ | ✔ |
| user banner (Friends list) | ✔ | ❌ | ✔ |
| user accent color (Friends list) | ✔ | ❌ | ✔ |

## Usage (for theme developers)

Add the following to your CSS (for default values)

```css
:root {
    /* live mouse position, useful for effects like reveal from microsoft's fluent design */
    --mouseX: 0px;
    --mouseY: 0px;
    /* mouse position during a click, stays in the same place until the mouse is released */
    --clickX: 0px;
    --clickY: 0px;
}
```

Then use the `--mouseX` and `--mouseY` CSS variables in your theme to access the mouse position.

Mouse position is relative to the element.

### More documentation

For available CSS variables read [Variables.md](https://github.com/hyblocker/discord-theme-helper/blob/main/Variables.md)

For new attributes which get added to the DOM read [Attributes.md](https://github.com/hyblocker/discord-theme-helper/blob/main/Attributes.md)

# Themes using this plugin

[Pixelcord by Hyblocker](https://github.com/hyblocker/pixelcord) :: Purely CSS based ripple

[Friends Grid by CorellanStoma](https://github.com/CorellanStoma/Friends-Grid) :: User banners and profile colors



> NB: Open an issue / PR to add your theme here!

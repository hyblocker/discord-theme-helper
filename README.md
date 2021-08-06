# Hyblocker's Theme Helper

A simple plugin which exposes the mouse position to CSS
That's literally it; its nothing special because it doesn't have to be :D

## Installation

## Powercord

Clone to plugins directory using

```bash
git clone https://github.com/hyblocker/discord-theme-helper.git
```

## BetterDiscord

Download the `HyblockerThemeHelper.plugin.js` file and drop it into your plugins folder.

## Usage (for theme developers)

Add the following to your CSS (for default values)

```css
::root {
    /* live mouse position, useful for effects like reveal from microsoft's fluent design */
    --mouseX: 0px;
    --mouseY: 0px;
    /* mouse position during a click, stays in the same place until the mouse is released */
    --clickX: 0px;
    --clickY: 0px;
}
```

Then use the `--mouseX` and `--mouseY` CSS variables in your theme to access the mouse position.

Mouse position is relative to the element

# Themes using this plugin

[Pixelcord](https://github.com/hyblocker/pixelcord) :: Purely CSS based ripple



> NB: Open an issue / PR to add your theme here!

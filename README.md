# Hyblocker's Theme Helper

A simple plugin which exposes the mouse position to CSS
That's literally it; its nothing special because it doesn't have to be :D

## Installation

Clone to plugins directory using

```bash
git clone https://github.com/hyblocker/discord-theme-helper.git
```

## Usage (for theme developers)

Add the following to your CSS (for default values)

```css
::root {
    --mouseX: 0px;
    --mouseY: 0px;
}
```

Then use the `--mouseX` and `--mouseY` CSS variables in your theme to access the mouse position.

Mouse position is relative to the element

# Themes using this plugin

[Pixelcord](https://github.com/hyblocker/pixelcord) :: Purely CSS based ripple



> NB: Open an issue / PR to add your theme here!

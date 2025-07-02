# Dynamic Weather System

A comprehensive weather system for Foundry VTT with multiple climate types, weather events, and historical tracking.

## Overview

The **Dynamic Weather System** module offers a robust solution for managing weather in your Foundry VTT campaigns. It allows you to simulate dynamic weather conditions, including temperature, precipitation, wind, and special events, adapted to different climate types and seasons.

## Features

*   **Dynamic Weather Generation**: Generates daily weather conditions based on the active climate type, season, and day/night temperature variations.
*   **Multiple Climate Types**: Supports various climates such as Temperate, Tropical, Desert, Arctic, Mediterranean, Continental, Oceanic, Subtropical, Monsoon, and Steppe, each with its unique characteristics.
*   **Special Weather Events**: Includes events like thunderstorms, banestorms, blizzards, sandstorms, strong winds, and hurricanes, with configurable probabilities.
*   **Weather History**: Maintains a detailed record of generated weather, allowing you to view patterns and statistics over time.
*   **User Controls (GM)**:
    *   **Control Panel**: A dedicated interface to view current weather, advance the day, change the time of day, and send weather to chat.
    *   **Climate Selector**: Easily switch between different available climate types.
    *   **Probability Settings**: Adjust the chances of weather events occurring to customize the experience.
    *   **Import/Export History**: Save and load your world's weather history.
*   **Chat Integration**: Share current weather conditions with your players directly in the Foundry VTT chat.
*   **Visual Effects (Future)**: Prepared for future implementations of visual effects on the canvas to represent weather.

## Installation

1.  **Manifest URL**: In Foundry VTT, go to the **Add-on Modules** tab.
2.  Click on **Install Module**.
3.  In the **Manifest URL** field, paste the following link:
    `https://raw.githubusercontent.com/boifuba/dynamic-weather-system/main/module.json`
4.  Click **Install**.
5.  After installation, activate the module in your world's settings.

## How to Use

### Opening the Weather Panel

You you can open the weather panel using a Macro provided within the module's compendium:

1.  Go to the **Compendiums** tab in Foundry VTT (the icon that looks like a stack of books).
2.  Open the **Dynamic Weather System** compendium.
3.  Drag the "Open Weather Panel" Macro from the compendium to your Hotbar.
4.  Click the Macro on your Hotbar to open the weather control panel.

### Panel Features

*   **"Current Weather" Tab**:
    *   View temperature, precipitation, wind, visibility, humidity, and pressure.
    *   See active weather events.
    *   **Advance Day**: Click the "⏭️ Next Day" button to generate weather for the next day.
    *   **Cycle Time of Day**: Click on the time of day (e.g., "Morning") to cycle between Morning, Afternoon, Evening, and Night.
    *   **Send to Chat**: Use the "💬 Send to Chat" button to share the current weather with players.
    *   **Override Weather**: The "🎛️ Override Weather" button allows you to manually set weather conditions.
    *   **Set Initial Date**: Use the "📅 Set Initial Date" button to adjust the starting date of the weather system.
    *   **View History**: The "📜 View History" button opens a window with the weather history.
*   **"Settings" Tab**:
    *   Adjust the probabilities of weather events occurring using the sliders.
    *   Reset individual probabilities or all to default values.
    *   Remember to click "💾 Save Settings" after making changes.
*   **"Statistics" Tab**:
    *   View statistics of the generated weather, such as average temperature, temperature range, precipitation days, and average wind speed.
    *   See the frequency of common weather events.

## Compatibility

*   **Foundry VTT**: Version 11, 12, and 13 (verified).

## Contribution

Feel free to report bugs or suggest improvements on the [GitHub Issues](https://github.com/boifuba/dynamic-weather-system/issues) page.

## License

This project is distributed under the MIT License.

## Credits

*   **Author**: boifubá (cefasheli@gmail.com)
*   **Repository**: [GitHub](https://github.com/boifuba/dynamic-weather-system)

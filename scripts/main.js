import { WeatherSystem } from './weather-system.js';
import { WeatherUI } from './weather-ui.js';
import { WeatherEffects } from './weather-effects.js';

Hooks.once('init', async function() {
    console.log('Dynamic Weather System | Initializing...');
    
    // Register module settings for data persistence
    game.settings.register('dynamic-weather-system', 'weatherHistory', {
        name: game.i18n.localize('dynamic-weather-system.settings.weatherHistory.name'),
        hint: game.i18n.localize('dynamic-weather-system.settings.weatherHistory.hint'),
        scope: 'world',
        config: false,
        type: Object,
        default: {},
        restricted: true
    });

    game.settings.register('dynamic-weather-system', 'activeClimate', {
        name: game.i18n.localize('dynamic-weather-system.settings.activeClimate.name'),
        hint: game.i18n.localize('dynamic-weather-system.settings.activeClimate.hint'),
        scope: 'world',
        config: false,
        type: String,
        default: 'temperate',
        restricted: true
    });

    game.settings.register('dynamic-weather-system', 'currentWeather', {
        name: game.i18n.localize('dynamic-weather-system.settings.currentWeather.name'),
        hint: game.i18n.localize('dynamic-weather-system.settings.currentWeather.hint'),
        scope: 'world',
        config: false,
        type: Object,
        default: {},
        restricted: true
    });

    // NEW: Register initial date setting
    game.settings.register('dynamic-weather-system', 'initialDate', {
        name: game.i18n.localize('dynamic-weather-system.settings.initialDate.name'),
        hint: game.i18n.localize('dynamic-weather-system.settings.initialDate.hint'),
        scope: 'world',
        config: false,
        type: String,
        default: '',
        restricted: true
    });

    // FONTE ÚNICA DE VERDADE PARA CONFIGURAÇÕES PADRÃO
    game.settings.register('dynamic-weather-system', 'weatherSettings', {
        name: game.i18n.localize('dynamic-weather-system.settings.weatherSettings.name'),
        hint: game.i18n.localize('dynamic-weather-system.settings.weatherSettings.hint'),
        scope: 'world',
        config: false,
        type: Object,
        default: {
            autoAdvance: true,
            realTimeSync: false,
            eventProbabilities: {
                thunderstorm: 0.05,      // 5% (reduced from 10%)
                banestorm: 0.02,         // 2% (reduced from 5%)
                hurricane: 0.01,         // 1% (reduced from 2%)
                blizzard: 0.04,          // 4% (reduced from 8%)
                sandstorm: 0.05,         // 5% (reduced from 10%)
                strongWinds: 0.08,       // 8% (reduced from 15%)
                snowChance: 0.15,        // 15% (reduced from 20%)
                extremeHeat: 0.03,       // 3% (reduced from 5%)
                extremeCold: 0.03,       // 3% (reduced from 5%)
                drought: 0.02,           // 2% (reduced from 3%)
                flood: 0.02              // 2% (reduced from 4%)
            }
        },
        restricted: true
    });

    // Initialize the weather system
    game.weatherSystem = new WeatherSystem();
    await game.weatherSystem.initialize();
    
    // Define global openWeatherPanel function early in init hook
    // This ensures it's available even if called before ready hook completes
    window.openWeatherPanel = () => {
        console.log('Dynamic Weather System | openWeatherPanel called');
        console.log('Dynamic Weather System | User is GM:', game.user.isGM);
        console.log('Dynamic Weather System | WeatherUI exists:', !!game.weatherUI);
        console.log('Dynamic Weather System | WeatherUI initialized:', game.weatherUI?.initialized);
        
        if (!game.user.isGM) {
            ui.notifications.warn(game.i18n.localize('dynamic-weather-system.notifications.noPermission'));
            console.warn('Dynamic Weather System | Non-GM user attempted to open weather panel');
            return;
        }
        
        if (game.weatherUI && game.weatherUI.initialized) {
            console.log('Dynamic Weather System | Opening weather panel via WeatherUI');
            game.weatherUI.openWeatherPanel();
        } else if (game.weatherUI) {
            console.warn('Dynamic Weather System | WeatherUI exists but not initialized yet');
            ui.notifications.warn(game.i18n.localize('dynamic-weather-system.notifications.systemInitializing'));
        } else {
            console.warn('Dynamic Weather System | WeatherUI not created yet');
            ui.notifications.warn(game.i18n.localize('dynamic-weather-system.notifications.systemNotReady'));
        }
    };
    
    console.log('Dynamic Weather System | Global openWeatherPanel function defined in init hook');
    console.log('Dynamic Weather System | Initialized successfully');
});

Hooks.once('ready', async function() {
    console.log('Dynamic Weather System | Ready hook triggered');
    console.log('Dynamic Weather System | User is GM:', game.user.isGM);
    
    // Initialize UI for GMs
    if (game.user.isGM) {
        console.log('Dynamic Weather System | Initializing WeatherUI for GM');
        game.weatherUI = new WeatherUI();
        await game.weatherUI.initialize();
        console.log('Dynamic Weather System | WeatherUI initialized successfully');
    } else {
        console.log('Dynamic Weather System | Skipping WeatherUI initialization (not GM)');
    }

    // Initialize weather effects
    console.log('Dynamic Weather System | Initializing WeatherEffects');
    game.weatherEffects = new WeatherEffects();
    await game.weatherEffects.initialize();
    console.log('Dynamic Weather System | WeatherEffects initialized');

    // Load saved weather data
    console.log('Dynamic Weather System | Loading weather data');
    await game.weatherSystem.loadWeatherData();
    console.log('Dynamic Weather System | Weather data loaded');
    
    console.log('Dynamic Weather System | Ready and loaded');
    console.log('Dynamic Weather System | openWeatherPanel function available:', typeof window.openWeatherPanel);
});

// Socket handling for weather updates
Hooks.on('ready', () => {
    console.log('Dynamic Weather System | Setting up socket listeners');
    game.socket.on('module.dynamic-weather-system', (data) => {
        console.log('Dynamic Weather System | Socket message received:', data.type);
        if (data.type === 'weatherUpdate') {
            game.weatherEffects.updateWeatherDisplay(data.weather);
        }
    });
});

// Auto-save weather data periodically
Hooks.on('updateWorldTime', async (worldTime, dt) => {
    if (game.user.isGM && game.weatherSystem) {
        await game.weatherSystem.handleTimeUpdate(worldTime, dt);
    }
});
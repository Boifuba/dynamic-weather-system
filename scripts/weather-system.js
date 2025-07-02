export class WeatherSystem {
    constructor() {
        this.weatherHistory = {};
        this.currentWeather = {};
        this.activeClimate = 'temperate';
        this.settings = {};
        this.initialized = false;
        this.autoSaveInterval = null;
        this.initialDate = null; // Data inicial definida pelo usuário
        
        // Definições dos tipos de clima disponíveis
        this.climateTypes = {
            temperate: {
                name: 'dynamic-weather-system.ui.climateTypes.temperate.name',
                baseTemperature: 15,
                seasonalVariation: 20,
                precipitationChance: 0.35,
                windiness: 0.4,
                description: 'dynamic-weather-system.ui.climateTypes.temperate.description'
            },
            tropical: {
                name: 'dynamic-weather-system.ui.climateTypes.tropical.name',
                baseTemperature: 28,
                seasonalVariation: 8,
                precipitationChance: 0.6,
                windiness: 0.3,
                description: 'dynamic-weather-system.ui.climateTypes.tropical.description'
            },
            desert: {
                name: 'dynamic-weather-system.ui.climateTypes.desert.name',
                baseTemperature: 35,
                seasonalVariation: 15,
                precipitationChance: 0.05,
                windiness: 0.6,
                description: 'dynamic-weather-system.ui.climateTypes.desert.description'
            },
            arctic: {
                name: 'dynamic-weather-system.ui.climateTypes.arctic.name',
                baseTemperature: -15,
                seasonalVariation: 25,
                precipitationChance: 0.2,
                windiness: 0.7,
                description: 'dynamic-weather-system.ui.climateTypes.arctic.description'
            },
            mediterranean: {
                name: 'dynamic-weather-system.ui.climateTypes.mediterranean.name',
                baseTemperature: 20,
                seasonalVariation: 12,
                precipitationChance: 0.25,
                windiness: 0.35,
                description: 'dynamic-weather-system.ui.climateTypes.mediterranean.description'
            },
            continental: {
                name: 'dynamic-weather-system.ui.climateTypes.continental.name',
                baseTemperature: 8,
                seasonalVariation: 30,
                precipitationChance: 0.3,
                windiness: 0.5,
                description: 'dynamic-weather-system.ui.climateTypes.continental.description'
            },
            oceanic: {
                name: 'dynamic-weather-system.ui.climateTypes.oceanic.name',
                baseTemperature: 12,
                seasonalVariation: 10,
                precipitationChance: 0.5,
                windiness: 0.6,
                description: 'dynamic-weather-system.ui.climateTypes.oceanic.description'
            },
            subtropical: {
                name: 'dynamic-weather-system.ui.climateTypes.subtropical.name',
                baseTemperature: 22,
                seasonalVariation: 15,
                precipitationChance: 0.4,
                windiness: 0.4,
                description: 'dynamic-weather-system.ui.climateTypes.subtropical.description'
            },
            monsoon: {
                name: 'dynamic-weather-system.ui.climateTypes.monsoon.name',
                baseTemperature: 26,
                seasonalVariation: 12,
                precipitationChance: 0.7,
                windiness: 0.5,
                description: 'dynamic-weather-system.ui.climateTypes.monsoon.description'
            },
            steppe: {
                name: 'dynamic-weather-system.ui.climateTypes.steppe.name',
                baseTemperature: 18,
                seasonalVariation: 25,
                precipitationChance: 0.15,
                windiness: 0.8,
                description: 'dynamic-weather-system.ui.climateTypes.steppe.description'
            }
        };
    }

    async initialize() {
        console.log('WeatherSystem | Initializing weather system...');
        this.initialized = true;
        
        // Set up auto-save interval (every 5 minutes)
        this.autoSaveInterval = setInterval(() => {
            if (game.user.isGM) {
                this.saveWeatherData();
            }
        }, 300000);
    }

    async loadWeatherData() {
        try {
            this.weatherHistory = await game.settings.get('dynamic-weather-system', 'weatherHistory') || {};
            this.activeClimate = await game.settings.get('dynamic-weather-system', 'activeClimate') || 'temperate';
            this.currentWeather = await game.settings.get('dynamic-weather-system', 'currentWeather') || {};
            this.settings = await game.settings.get('dynamic-weather-system', 'weatherSettings');
            
            // NEW: Load initial date
            const savedInitialDate = await game.settings.get('dynamic-weather-system', 'initialDate');
            if (savedInitialDate) {
                this.initialDate = new Date(savedInitialDate);
            }
            
            // Fix: Convert date strings back to Date objects after loading from settings
            if (this.currentWeather.date && typeof this.currentWeather.date === 'string') {
                this.currentWeather.date = new Date(this.currentWeather.date);
            }
            
            // Fix weather history dates
            for (const climate in this.weatherHistory) {
                for (const dateKey in this.weatherHistory[climate]) {
                    const entry = this.weatherHistory[climate][dateKey];
                    if (entry.date && typeof entry.date === 'string') {
                        entry.date = new Date(entry.date);
                    }
                }
            }
            
            console.log('WeatherSystem | Weather data loaded successfully');
            console.log('WeatherSystem | Active climate:', this.activeClimate);
            console.log('WeatherSystem | History entries:', Object.keys(this.weatherHistory).length);
            console.log('WeatherSystem | Initial date:', this.initialDate);
            console.log('WeatherSystem | Event probabilities loaded:', this.settings.eventProbabilities);
            
        } catch (error) {
            console.error('WeatherSystem | Error loading weather data:', error);
        }
    }

    async saveWeatherData() {
        try {
            await game.settings.set('dynamic-weather-system', 'weatherHistory', this.weatherHistory);
            await game.settings.set('dynamic-weather-system', 'activeClimate', this.activeClimate);
            await game.settings.set('dynamic-weather-system', 'currentWeather', this.currentWeather);
            await game.settings.set('dynamic-weather-system', 'weatherSettings', this.settings);
            
            // NEW: Save initial date
            if (this.initialDate) {
                await game.settings.set('dynamic-weather-system', 'initialDate', this.initialDate.toISOString());
            }
            
            console.log('WeatherSystem | Weather data saved successfully');
        } catch (error) {
            console.error('WeatherSystem | Error saving weather data:', error);
        }
    }

    // FIXED: Definir data inicial e atualizar clima atual
    async setInitialDate(date) {
        this.initialDate = new Date(date);
        
        // Update current weather to use this date
        if (Object.keys(this.currentWeather).length > 0) {
            this.currentWeather.date = new Date(this.initialDate);
        }
        
        // Save the changes
        await this.saveWeatherData();
        
        console.log('WeatherSystem | Initial date set to:', this.initialDate);
        console.log('WeatherSystem | Current weather date updated to:', this.currentWeather.date);
    }

    // FIXED: Obter data atual (usa data inicial se definida, senão data do clima atual, senão data atual)
    getCurrentGameDate() {
        // Priority: current weather date > initial date > current date
        if (this.currentWeather && this.currentWeather.date) {
            return new Date(this.currentWeather.date);
        }
        
        if (this.initialDate) {
            return new Date(this.initialDate);
        }
        
        return new Date(); // Fallback para data atual
    }

    // Mudar o tipo de clima ativo
    async setActiveClimate(climateType) {
        if (!this.climateTypes[climateType]) {
            console.warn(`WeatherSystem | Climate type ${climateType} does not exist`);
            return false;
        }
        
        this.activeClimate = climateType;
        await this.saveWeatherData();
        
        console.log(`WeatherSystem | Climate changed to: ${game.i18n.localize(this.climateTypes[climateType].name)}`);
        return true;
    }

    // Obter informações do clima ativo
    getActiveClimateInfo() {
        const climate = this.climateTypes[this.activeClimate];
        return {
            type: this.activeClimate,
            name: game.i18n.localize(climate.name),
            description: game.i18n.localize(climate.description),
            baseTemperature: climate.baseTemperature,
            seasonalVariation: climate.seasonalVariation,
            precipitationChance: climate.precipitationChance,
            windiness: climate.windiness
        };
    }

    // Obter todos os tipos de clima disponíveis
    getAvailableClimates() {
        const climates = {};
        for (const [key, climate] of Object.entries(this.climateTypes)) {
            climates[key] = {
                name: game.i18n.localize(climate.name),
                description: game.i18n.localize(climate.description),
                baseTemperature: climate.baseTemperature,
                seasonalVariation: climate.seasonalVariation,
                precipitationChance: climate.precipitationChance,
                windiness: climate.windiness
            };
        }
        return climates;
    }

    // Export weather history to JSON file
    async exportWeatherHistory() {
        try {
            const exportData = {
                weatherHistory: this.weatherHistory,
                activeClimate: this.activeClimate,
                currentWeather: this.currentWeather,
                settings: this.settings,
                initialDate: this.initialDate ? this.initialDate.toISOString() : null,
                exportDate: new Date().toISOString(),
                version: "1.0.0"
            };

            const dataStr = JSON.stringify(exportData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            
            const link = document.createElement('a');
            link.href = URL.createObjectURL(dataBlob);
            link.download = `weather-history-${this.activeClimate}-${new Date().toISOString().split('T')[0]}.json`;
            link.click();
            
            console.log('WeatherSystem | Weather history exported');
            ui.notifications.info(game.i18n.localize('dynamic-weather-system.notifications.historyExported'));
            
        } catch (error) {
            console.error('WeatherSystem | Error exporting weather history:', error);
        }
    }

    // Import weather history from JSON file
    async importWeatherHistory(file) {
        try {
            const text = await file.text();
            const importData = JSON.parse(text);
            
            // Validate import data structure
            if (!importData.weatherHistory) {
                throw new Error(game.i18n.localize('dynamic-weather-system.notifications.invalidHistoryFormat'));
            }
            
            // Import data
            this.weatherHistory = importData.weatherHistory || {};
            this.activeClimate = importData.activeClimate || 'temperate';
            this.currentWeather = importData.currentWeather || {};
            this.settings = { ...this.settings, ...importData.settings };
            
            // Import initial date if available
            if (importData.initialDate) {
                this.initialDate = new Date(importData.initialDate);
            }
            
            // Save imported data
            await this.saveWeatherData();
            
            console.log('WeatherSystem | Weather history imported');
            ui.notifications.info(game.i18n.localize('dynamic-weather-system.notifications.historyImported'));
            
            // Refresh UI if available
            if (game.weatherUI) {
                game.weatherUI.refresh();
            }
            
        } catch (error) {
            console.error('WeatherSystem | Error importing weather history:', error);
            ui.notifications.error(error.message);
        }
    }

    // Add weather entry to history
    addToHistory(weatherData) {
        const dateKey = this.formatDateKey(weatherData.date);
        const climateKey = this.activeClimate;
        
        if (!this.weatherHistory[climateKey]) {
            this.weatherHistory[climateKey] = {};
        }
        
        this.weatherHistory[climateKey][dateKey] = {
            ...weatherData,
            timestamp: Date.now()
        };
        
        // Limit history size (keep last 365 days per climate)
        this.pruneHistory(climateKey);
    }

    // Remove old history entries to prevent unlimited growth
    pruneHistory(climateType, maxDays = 365) {
        if (!this.weatherHistory[climateType]) return;
        
        const entries = Object.entries(this.weatherHistory[climateType]);
        if (entries.length <= maxDays) return;
        
        // Sort by date and keep only the most recent entries
        entries.sort((a, b) => new Date(b[1].date) - new Date(a[1].date));
        
        const prunedHistory = {};
        entries.slice(0, maxDays).forEach(([key, value]) => {
            prunedHistory[key] = value;
        });
        
        this.weatherHistory[climateType] = prunedHistory;
        console.log(`WeatherSystem | Pruned history for climate ${climateType}, kept ${maxDays} entries`);
    }

    // Get weather history for the active climate and date range
    getWeatherHistory(startDate = null, endDate = null) {
        const climateHistory = this.weatherHistory[this.activeClimate] || {};
        let entries = Object.values(climateHistory);
        
        if (startDate) {
            entries = entries.filter(entry => new Date(entry.date) >= new Date(startDate));
        }
        
        if (endDate) {
            entries = entries.filter(entry => new Date(entry.date) <= new Date(endDate));
        }
        
        return entries.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    // Get weather patterns and statistics for active climate
    getWeatherStatistics(days = 30) {
        const history = this.getWeatherHistory();
        const recentHistory = history.slice(-days);
        
        if (recentHistory.length === 0) return null;
        
        const stats = {
            climate: this.getActiveClimateInfo(),
            averageTemperature: 0,
            temperatureRange: { min: Infinity, max: -Infinity },
            precipitationDays: 0,
            averageWindSpeed: 0,
            commonWeatherEvents: {},
            totalDays: recentHistory.length
        };
        
        recentHistory.forEach(entry => {
            stats.averageTemperature += entry.temperature;
            stats.temperatureRange.min = Math.min(stats.temperatureRange.min, entry.temperature);
            stats.temperatureRange.max = Math.max(stats.temperatureRange.max, entry.temperature);
            
            if (entry.precipitation !== 'none') {
                stats.precipitationDays++;
            }
            
            stats.averageWindSpeed += entry.windSpeed;
            
            if (entry.events && entry.events.length > 0) {
                entry.events.forEach(event => {
                    stats.commonWeatherEvents[event.type] = (stats.commonWeatherEvents[event.type] || 0) + 1;
                });
            }
        });
        
        stats.averageTemperature = Math.round((stats.averageTemperature / recentHistory.length) * 10) / 10;
        stats.averageWindSpeed = Math.round((stats.averageWindSpeed / recentHistory.length) * 10) / 10;
        stats.precipitationPercentage = Math.round((stats.precipitationDays / recentHistory.length) * 100);
        
        return stats;
    }

    generateWeatherForClimate(date, previousWeather = null) {
        const climate = this.climateTypes[this.activeClimate];
        if (!climate) return null;

        const season = this.getSeason(date);
        
        // Get previous weather for consistency
        if (!previousWeather) {
            const yesterday = new Date(date);
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayKey = this.formatDateKey(yesterday);
            previousWeather = this.weatherHistory[this.activeClimate]?.[yesterdayKey];
        }
        
        // Base weather generation with seasonal adjustments
        let temperature = climate.baseTemperature + this.getSeasonalTemperatureAdjustment(season, climate.seasonalVariation);
        
        // Weather consistency - if we have previous weather, trend towards it
        if (previousWeather) {
            temperature = this.applyWeatherConsistency(temperature, previousWeather.temperature, 0.7);
        }
        
        // Add daily variation with day/night cycle
        const timeOfDay = Math.random(); // 0-1 representing time of day
        const dailyVariation = this.getDailyTemperatureVariation(timeOfDay, season);
        temperature += dailyVariation;
        
        // Climate-specific adjustments
        temperature = this.applyClimateSpecificAdjustments(temperature, season, timeOfDay);
        
        // Generate precipitation based on climate and temperature
        const precipitationRoll = Math.random();
        let precipitation = 'none';
        let precipitationIntensity = 0;
        
        const adjustedPrecipChance = this.getSeasonalPrecipitationChance(climate.precipitationChance, season);
        
        if (precipitationRoll < adjustedPrecipChance) {
            const precipTypes = this.getPrecipitationTypesForClimate(temperature);
            precipitation = precipTypes[Math.floor(Math.random() * precipTypes.length)];
            precipitationIntensity = Math.random();
        }
        
        // FIXED: Generate wind with higher maximum potential
        const windSpeed = Math.random() * climate.windiness * 80; // Increased from 50 to 80 km/h
        const windDirection = Math.floor(Math.random() * 360);
        
        // Calculate visibility
        let visibility = 10; // km
        if (precipitation !== 'none') {
            visibility = Math.max(0.5, 10 - (precipitationIntensity * 8));
        }
        
        // Check for weather events
        const weatherEvents = this.checkForWeatherEvents(climate, temperature, precipitation, windSpeed, season);
        
        const weather = {
            climate: this.activeClimate,
            date: date,
            temperature: Math.round(temperature * 10) / 10,
            precipitation,
            precipitationIntensity: Math.round(precipitationIntensity * 100) / 100,
            windSpeed: Math.round(windSpeed * 10) / 10,
            windDirection,
            visibility: Math.round(visibility * 10) / 10,
            humidity: this.calculateHumidity(climate, precipitation, temperature),
            pressure: Math.round((980 + Math.random() * 60) * 10) / 10,
            events: weatherEvents,
            season,
            timeOfDay: timeOfDay < 0.25 ? 'night' : timeOfDay < 0.5 ? 'morning' : timeOfDay < 0.75 ? 'afternoon' : 'evening'
        };
        
        return weather;
    }

    // Gerar clima para período específico do dia
    generateWeatherForTimeOfDay(baseWeather, timeOfDay) {
        const weather = { ...baseWeather };
        
        // Ajustar temperatura baseado no período do dia
        let tempAdjustment = 0;
        switch (timeOfDay) {
            case 'night':
                tempAdjustment = -8;
                break;
            case 'morning':
                tempAdjustment = -3;
                break;
            case 'afternoon':
                tempAdjustment = 5;
                break;
            case 'evening':
                tempAdjustment = 0;
                break;
        }
        
        // Aplicar ajustes específicos do clima
        const seasonalMultiplier = {
            'spring': 1.0,
            'summer': 1.3,
            'autumn': 1.0,
            'winter': 0.7
        };
        
        tempAdjustment *= (seasonalMultiplier[weather.season] || 1.0);
        
        // Aplicar ajustes específicos do tipo de clima
        switch (this.activeClimate) {
            case 'desert':
                if (timeOfDay === 'night') tempAdjustment -= 12;
                if (timeOfDay === 'afternoon') tempAdjustment += 10;
                break;
            case 'tropical':
                tempAdjustment *= 0.5; // Menor variação
                break;
            case 'arctic':
                tempAdjustment *= 0.3; // Muito menor variação
                break;
        }
        
        weather.temperature = Math.round((weather.temperature + tempAdjustment) * 10) / 10;
        weather.timeOfDay = timeOfDay;
        
        return weather;
    }

    // New method for day/night temperature variation
    getDailyTemperatureVariation(timeOfDay, season) {
        // timeOfDay: 0-0.25 = night, 0.25-0.5 = morning, 0.5-0.75 = afternoon, 0.75-1 = evening
        let variation = 0;
        
        if (timeOfDay < 0.25) { // Night - coldest
            variation = -8;
        } else if (timeOfDay < 0.5) { // Morning - cool
            variation = -3;
        } else if (timeOfDay < 0.75) { // Afternoon - warmest
            variation = 5;
        } else { // Evening - moderate
            variation = 0;
        }
        
        // Seasonal adjustments to daily variation
        const seasonalMultiplier = {
            'spring': 1.0,
            'summer': 1.3, // Bigger daily swings in summer
            'autumn': 1.0,
            'winter': 0.7  // Smaller daily swings in winter
        };
        
        return variation * (seasonalMultiplier[season] || 1.0);
    }

    // Enhanced climate-specific adjustments with time of day
    applyClimateSpecificAdjustments(temperature, season, timeOfDay) {
        switch (this.activeClimate) {
            case 'desert':
                // Desert: extreme daily variations
                if (timeOfDay < 0.25) { // Night
                    temperature -= 20;
                } else if (timeOfDay > 0.5 && timeOfDay < 0.75) { // Afternoon
                    temperature += 15;
                }
                break;
                
            case 'tropical':
                // Tropical: less variation, more stable
                temperature = Math.max(20, temperature);
                // Reduce daily variation in tropical climates
                if (timeOfDay < 0.25) temperature += 5; // Nights not as cold
                break;
                
            case 'arctic':
                // Arctic: always cold, extreme wind chill
                temperature = Math.min(-5, temperature);
                break;
                
            case 'mediterranean':
                // Mediterranean: hot dry summers, mild winters
                if (season === 'summer') {
                    temperature += 5;
                    if (timeOfDay > 0.5 && timeOfDay < 0.75) { // Hot afternoons
                        temperature += 8;
                    }
                }
                break;
                
            case 'oceanic':
                // Oceanic: moderated by sea, less daily variation
                const moderationFactor = 0.5;
                if (timeOfDay < 0.25) temperature += 3 * moderationFactor; // Warmer nights
                if (timeOfDay > 0.5 && timeOfDay < 0.75) temperature -= 2 * moderationFactor; // Cooler days
                break;
        }
        
        return temperature;
    }

    // Enhanced precipitation types with snow chance
    getPrecipitationTypesForClimate(temperature) {
        const snowChance = this.settings.eventProbabilities?.snowChance || 0.15;
        
        if (temperature < -2) {
            return Math.random() < snowChance ? ['snow'] : ['snow', 'sleet'];
        } else if (temperature < 5) {
            const types = ['sleet', 'rain', 'drizzle'];
            if (Math.random() < snowChance * 0.5) { // Reduced chance but still possible
                types.push('snow');
            }
            return types;
        } else {
            switch (this.activeClimate) {
                case 'tropical':
                case 'monsoon':
                    return ['rain', 'heavy-rain'];
                case 'desert':
                    return ['drizzle', 'rain'];
                case 'arctic':
                    return Math.random() < snowChance ? ['snow', 'sleet'] : ['sleet'];
                default:
                    return ['drizzle', 'rain'];
            }
        }
    }

    // Chance de precipitação ajustada por estação e clima
    getSeasonalPrecipitationChance(baseChance, season) {
        const adjustments = {
            temperate: { spring: 1.2, summer: 0.8, autumn: 1.1, winter: 1.0 },
            tropical: { spring: 1.5, summer: 2.0, autumn: 1.5, winter: 0.5 },
            desert: { spring: 1.5, summer: 0.5, autumn: 1.0, winter: 2.0 },
            mediterranean: { spring: 1.0, summer: 0.3, autumn: 1.2, winter: 1.8 },
            monsoon: { spring: 0.8, summer: 3.0, autumn: 2.0, winter: 0.5 },
            arctic: { spring: 0.8, summer: 0.6, autumn: 1.0, winter: 1.4 }
        };
        
        const climateAdj = adjustments[this.activeClimate] || adjustments.temperate;
        return Math.min(0.9, baseChance * (climateAdj[season] || 1.0));
    }

    // Calcular umidade baseada no clima
    calculateHumidity(climate, precipitation, temperature) {
        let baseHumidity = 50;
        
        switch (this.activeClimate) {
            case 'tropical':
            case 'monsoon':
                baseHumidity = 80;
                break;
            case 'desert':
                baseHumidity = 20;
                break;
            case 'oceanic':
                baseHumidity = 75;
                break;
            case 'mediterranean':
                baseHumidity = 60;
                break;
            case 'arctic':
                baseHumidity = 65;
                break;
        }
        
        // Ajustar pela precipitação
        if (precipitation !== 'none') {
            baseHumidity += 20;
        }
        
        // Ajustar pela temperatura
        if (temperature > 30) {
            baseHumidity -= 10;
        } else if (temperature < 0) {
            baseHumidity -= 15;
        }
        
        return Math.max(10, Math.min(100, Math.round(baseHumidity + (Math.random() - 0.5) * 20)));
    }

    checkForWeatherEvents(climate, temperature, precipitation, windSpeed, season) {
        const events = [];
        const probabilities = this.settings.eventProbabilities || {};
        
        console.log('WeatherSystem | Checking weather events with probabilities:', probabilities);
        console.log('WeatherSystem | Wind speed for event checks:', windSpeed);
        
        // Eventos específicos por clima
        switch (this.activeClimate) {
            case 'tropical':
            case 'monsoon':
                if (temperature > 25 && precipitation !== 'none' && Math.random() < (probabilities.thunderstorm || 0.05)) {
                    events.push({
                        type: 'thunderstorm',
                        intensity: Math.random() * 0.5 + 0.5,
                        duration: Math.floor(Math.random() * 6) + 2
                    });
                    console.log('WeatherSystem | Thunderstorm event triggered');
                }
                break;
                
            case 'desert':
                if (windSpeed > 35 && Math.random() < (probabilities.sandstorm || 0.05)) {
                    events.push({
                        type: 'sandstorm',
                        intensity: Math.random() * 0.6 + 0.4,
                        duration: Math.floor(Math.random() * 8) + 2
                    });
                    console.log('WeatherSystem | Sandstorm event triggered');
                }
                break;
                
            case 'arctic':
                if (temperature < -10 && windSpeed > 25 && Math.random() < (probabilities.blizzard || 0.04)) {
                    events.push({
                        type: 'blizzard',
                        intensity: Math.random() * 0.6 + 0.4,
                        duration: Math.floor(Math.random() * 12) + 6
                    });
                    console.log('WeatherSystem | Blizzard event triggered');
                }
                break;
        }
        
        // Eventos gerais - FIXED: Reduced banestorm probability and adjusted wind thresholds
        if (Math.random() < (probabilities.banestorm || 0.02)) {
            events.push({
                type: 'banestorm',
                intensity: Math.random() * 0.5 + 0.5,
                duration: Math.floor(Math.random() * 3) + 1,
                magicalEffects: true
            });
            console.log('WeatherSystem | Banestorm event triggered');
        }
        
        // FIXED: Strong winds event - reduced threshold from 40 to 25 km/h
        if (windSpeed > 25 && Math.random() < (probabilities.strongWinds || 0.08)) {
            events.push({
                type: 'strongWinds',
                intensity: Math.random() * 0.4 + 0.6,
                duration: Math.floor(Math.random() * 4) + 2
            });
            console.log('WeatherSystem | Strong winds event triggered');
        }
        
        // FIXED: Hurricane event - reduced threshold from 60 to 40 km/h
        if (windSpeed > 40 && precipitation !== 'none' && Math.random() < (probabilities.hurricane || 0.01)) {
            events.push({
                type: 'hurricane',
                intensity: Math.random() * 0.3 + 0.7,
                duration: Math.floor(Math.random() * 24) + 12
            });
            console.log('WeatherSystem | Hurricane event triggered');
        }
        
        console.log('WeatherSystem | Generated events:', events);
        return events;
    }

    async handleTimeUpdate(worldTime, deltaTime) {
        if (!this.initialized) return;
        
        const currentDate = this.getCurrentGameDate();
        const dateKey = this.formatDateKey(currentDate);
        
        // Check if we need to generate new weather
        const climateHistory = this.weatherHistory[this.activeClimate] || {};
        if (!climateHistory[dateKey]) {
            const newWeather = this.generateWeatherForClimate(currentDate);
            this.currentWeather = newWeather;
            this.addToHistory(newWeather);
            
            // Broadcast weather update
            if (game.user.isGM) {
                game.socket.emit('module.dynamic-weather-system', {
                    type: 'weatherUpdate',
                    weather: newWeather
                });
            }
        }
        
        // Auto-save periodically
        if (Math.random() < 0.1) { // 10% chance per time update
            await this.saveWeatherData();
        }
    }

    // Utility methods
    formatDateKey(date) {
        // Fix: Ensure date is a Date object before calling toISOString
        if (!(date instanceof Date)) {
            date = new Date(date);
        }
        return date.toISOString().split('T')[0];
    }

    getSeason(date) {
        const month = date.getMonth();
        if (month >= 2 && month <= 4) return 'spring';
        if (month >= 5 && month <= 7) return 'summer';
        if (month >= 8 && month <= 10) return 'autumn';
        return 'winter';
    }

    getSeasonalTemperatureAdjustment(season, variation) {
        const adjustments = {
            spring: variation * 0.2,
            summer: variation * 0.5,
            autumn: variation * 0.1,
            winter: -variation * 0.4
        };
        return adjustments[season] || 0;
    }

    applyWeatherConsistency(newValue, previousValue, consistency = 0.7) {
        return newValue * (1 - consistency) + previousValue * consistency;
    }

    // API methods
    getCurrentWeather() {
        return this.currentWeather;
    }

    async setWeather(weatherData) {
        this.currentWeather = weatherData;
        this.addToHistory(weatherData);
        await this.saveWeatherData();
        
        // Broadcast update
        if (game.user.isGM) {
            game.socket.emit('module.dynamic-weather-system', {
                type: 'weatherUpdate',
                weather: weatherData
            });
        }
        
        return true;
    }

    // Clean up on module disable
    destroy() {
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
        }
    }
}
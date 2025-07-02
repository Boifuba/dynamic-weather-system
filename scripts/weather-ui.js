export class WeatherUI {
    constructor() {
        this.app = null;
        this.isOpen = false;
        this.initialized = false;
    }

    async initialize() {
        console.log('WeatherUI | Initializing weather UI...');
        
        // Register Handlebars helpers
        this.registerHandlebarsHelpers();

        // Mark as initialized
        this.initialized = true;
        
        console.log('WeatherUI | UI initialized successfully');
        console.log('WeatherUI | Initialized flag set to:', this.initialized);
    }

    registerHandlebarsHelpers() {
        Handlebars.registerHelper('formatDate', function(date) {
            if (!date) return 'N/A';
            const d = new Date(date);
            return d.toLocaleDateString(game.i18n.lang);
        });

        Handlebars.registerHelper('getSeasonIcon', function(season) {
            const icons = {
                'spring': '🌸',
                'summer': '☀️',
                'autumn': '🍂',
                'winter': '❄️'
            };
            return icons[season] || '🌍';
        });

        // UPDATED: Enhanced weather icon helper with time of day support
        Handlebars.registerHelper('getWeatherIcon', function(precipitation, temperature, timeOfDay) {
            // For precipitation, use existing icons regardless of time of day
            if (precipitation !== 'none') {
                const icons = {
                    'drizzle': '🌦️',
                    'rain': '🌧️',
                    'heavy-rain': '⛈️',
                    'snow': '❄️',
                    'sleet': '🌨️'
                };
                return icons[precipitation] || '🌤️';
            }
            
            // For clear weather, consider time of day
            if (timeOfDay === 'night') {
                // Night time - use moon icon for clear skies
                return '🌙';
            } else {
                // Day time - use temperature-based icons
                if (temperature > 25) return '☀️';  // Clear and hot
                if (temperature > 15) return '⛅';  // Partly cloudy
                return '☁️';  // Cloudy/cool
            }
        });

        Handlebars.registerHelper('getWeatherIconClass', function(precipitation, temperature, timeOfDay) {
            // For precipitation, use existing classes regardless of time of day
            if (precipitation !== 'none') {
                const classes = {
                    'drizzle': 'weather-icon-drizzle',
                    'rain': 'weather-icon-rain',
                    'heavy-rain': 'weather-icon-heavy-rain',
                    'snow': 'weather-icon-snow',
                    'sleet': 'weather-icon-sleet'
                };
                return classes[precipitation] || 'weather-icon-partly-cloudy';
            }
            
            // For clear weather, consider time of day
            if (timeOfDay === 'night') {
                return 'weather-icon-night';
            } else {
                if (temperature > 25) return 'weather-icon-clear';
                if (temperature > 15) return 'weather-icon-partly-cloudy';
                return 'weather-icon-cloudy';
            }
        });

        Handlebars.registerHelper('getWeatherCondition', function(precipitation, temperature) {
            if (precipitation === 'none') {
                if (temperature > 30) return game.i18n.localize('dynamic-weather-system.ui.weatherConditions.veryHot');
                if (temperature > 25) return game.i18n.localize('dynamic-weather-system.ui.weatherConditions.sunny');
                if (temperature > 15) return game.i18n.localize('dynamic-weather-system.ui.weatherConditions.partlyCloudy');
                if (temperature > 5) return game.i18n.localize('dynamic-weather-system.ui.weatherConditions.cloudy');
                return game.i18n.localize('dynamic-weather-system.ui.weatherConditions.cold');
            }
            
            const conditionKey = `dynamic-weather-system.ui.weatherConditions.${precipitation.replace('-', '')}`;
            return game.i18n.localize(conditionKey);
        });

        Handlebars.registerHelper('getEventIcon', function(event) {
            const icons = {
                'thunderstorm': '⛈️',
                'banestorm': '🌪️',
                'blizzard': '🌨️',
                'sandstorm': '🏜️',
                'hurricane': '🌀',
                'strongWinds': '💨'
            };
            return icons[event] || '⚡';
        });

        Handlebars.registerHelper('getWindDirection', function(degrees) {
            const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
            const index = Math.round(degrees / 45) % 8;
            const directionKey = directions[index];
            return game.i18n.localize(`dynamic-weather-system.ui.windDirections.${directionKey}`);
        });

        Handlebars.registerHelper('formatPercentage', function(value) {
            return Math.round(value * 100) + '%';
        });

        Handlebars.registerHelper('getPercentage', function(value) {
            return Math.round((value || 0) * 100);
        });

        // Localization helpers
        Handlebars.registerHelper('localize', function(key) {
            return game.i18n.localize(key);
        });

        Handlebars.registerHelper('localizeWeatherType', function(type) {
            return game.i18n.localize(`dynamic-weather-system.ui.weatherTypes.${type}`);
        });

        Handlebars.registerHelper('localizeSeason', function(season) {
            return game.i18n.localize(`dynamic-weather-system.ui.seasons.${season}`);
        });

        Handlebars.registerHelper('localizeTimeOfDay', function(timeOfDay) {
            return game.i18n.localize(`dynamic-weather-system.ui.timeOfDay.${timeOfDay}`);
        });

        Handlebars.registerHelper('localizeEvent', function(event) {
            return game.i18n.localize(`dynamic-weather-system.ui.events.${event}`);
        });
    }

    toggleWeatherPanel() {
        console.log('WeatherUI | toggleWeatherPanel called, isOpen:', this.isOpen);
        if (this.isOpen) {
            this.closeWeatherPanel();
        } else {
            this.openWeatherPanel();
        }
    }

    async openWeatherPanel() {
        console.log('WeatherUI | openWeatherPanel called');
        
        if (this.app) {
            console.log('WeatherUI | Closing existing weather panel');
            this.app.close();
        }

        console.log('WeatherUI | Creating new WeatherControlPanel');
        this.app = new WeatherControlPanel();
        this.app.render(true);
        this.isOpen = true;
        
        console.log('WeatherUI | Weather panel opened successfully');
    }

    closeWeatherPanel() {
        console.log('WeatherUI | closeWeatherPanel called');
        if (this.app) {
            this.app.close();
            this.app = null;
        }
        this.isOpen = false;
        console.log('WeatherUI | Weather panel closed');
    }

    async openClimateSelector() {
        console.log('WeatherUI | openClimateSelector called');
        new ClimateSelectionDialog().render(true);
    }

    async exportWeatherHistory() {
        console.log('WeatherUI | exportWeatherHistory called');
        if (game.weatherSystem) {
            await game.weatherSystem.exportWeatherHistory();
        }
    }

    async importWeatherHistory() {
        console.log('WeatherUI | importWeatherHistory called');
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = async (event) => {
            const file = event.target.files[0];
            if (file && game.weatherSystem) {
                await game.weatherSystem.importWeatherHistory(file);
            }
        };
        
        input.click();
    }

    refresh() {
        console.log('WeatherUI | refresh called');
        if (this.app && this.app.rendered) {
            this.app.render();
        }
    }
}

class ClimateSelectionDialog extends Dialog {
    constructor() {
        const climates = game.weatherSystem.getAvailableClimates();
        const activeClimate = game.weatherSystem.activeClimate;
        
        let content = `<form class="climate-selection-dialog">
            <div class="form-group">
                <label>${game.i18n.localize('dynamic-weather-system.ui.dialogs.climateSelection.label')}</label>
                <select name="climate">`;
        
        for (const [key, climate] of Object.entries(climates)) {
            const selected = key === activeClimate ? 'selected' : '';
            content += `<option value="${key}" ${selected}>${climate.name}</option>`;
        }
        
        content += '</select></div>';
        
        // Add climate descriptions
        content += '<div class="climate-descriptions">';
        for (const [key, climate] of Object.entries(climates)) {
            content += `<div class="climate-desc" data-climate="${key}" style="display: ${key === activeClimate ? 'block' : 'none'};">
                <h4>${climate.name}</h4>
                <p>${climate.description}</p>
                <ul>
                    <li>${game.i18n.localize('dynamic-weather-system.ui.dialogs.climateSelection.baseTemperature')}: ${climate.baseTemperature}°C</li>
                    <li>${game.i18n.localize('dynamic-weather-system.ui.dialogs.climateSelection.seasonalVariation')}: ${climate.seasonalVariation}°C</li>
                    <li>${game.i18n.localize('dynamic-weather-system.ui.dialogs.climateSelection.precipitationChance')}: ${Math.round(climate.precipitationChance * 100)}%</li>
                    <li>${game.i18n.localize('dynamic-weather-system.ui.dialogs.climateSelection.windIntensity')}: ${Math.round(climate.windiness * 100)}%</li>
                </ul>
            </div>`;
        }
        content += '</div></form>';

        super({
            title: game.i18n.localize('dynamic-weather-system.ui.dialogs.climateSelection.title'),
            content: content,
            buttons: {
                apply: {
                    label: game.i18n.localize('dynamic-weather-system.ui.buttons.apply'),
                    callback: async (html) => {
                        const selectedClimate = html.find('select[name="climate"]').val();
                        await game.weatherSystem.setActiveClimate(selectedClimate);
                        
                        if (game.weatherUI.app) {
                            game.weatherUI.app.render();
                        }
                    }
                },
                cancel: {
                    label: game.i18n.localize('dynamic-weather-system.ui.buttons.cancel')
                }
            },
            default: 'apply'
        }, {
            resizable: true,
            cssClass: 'dynamic-weather-dialog'
        });
    }

    activateListeners(html) {
        super.activateListeners(html);
        
        html.find('select[name="climate"]').change((event) => {
            const selectedClimate = event.target.value;
            html.find('.climate-desc').hide();
            html.find(`[data-climate="${selectedClimate}"]`).show();
        });
    }
}

class WeatherControlPanel extends Application {
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            id: 'weather-control-panel',
            title: game.i18n.localize('dynamic-weather-system.ui.title'),
            template: 'modules/dynamic-weather-system/templates/weather-panel.hbs',
            width: 500,
            resizable: true,
            cssClass: 'dynamic-weather-panel',
            tabs: [
                { navSelector: '.tabs', contentSelector: '.tab-content', initial: 'current' }
            ]
        });
    }

    getData() {
        const currentWeather = game.weatherSystem.getCurrentWeather();
        const climateInfo = game.weatherSystem.getActiveClimateInfo();
        const statistics = game.weatherSystem.getWeatherStatistics(30);
        
        return {
            currentWeather,
            climateInfo,
            statistics,
            settings: game.weatherSystem.settings,
            hasWeather: Object.keys(currentWeather).length > 0
        };
    }

    activateListeners(html) {
        super.activateListeners(html);

        // Manual weather override
        html.find('.override-weather').click(this._onOverrideWeather.bind(this));
        
        // Advance day button
        html.find('.advance-day').click(this._onAdvanceDay.bind(this));
        
        // Cycle time of day
        html.find('[data-action="cycle-time-of-day"]').click(this._onCycleTimeOfDay.bind(this));
        
        // Set initial date
        html.find('.set-initial-date').click(this._onSetInitialDate.bind(this));
        
        // Send to chat
        html.find('.send-to-chat').click(this._onSendToChat.bind(this));
        
        // Settings updates
        html.find('.probability-slider').on('input', this._onProbabilityChange.bind(this));
        html.find('.reset-probability').click(this._onResetProbability.bind(this));
        html.find('.reset-all-probabilities').click(this._onResetAllProbabilities.bind(this));
        html.find('.save-settings').click(this._onSaveSettings.bind(this));
        
        // View history
        html.find('.view-history').click(this._onViewHistory.bind(this));
        
        // Change climate
        html.find('.change-climate').click(this._onChangeClimate.bind(this));
    }

    async _onSendToChat(event) {
        console.log('WeatherUI | Sending weather to chat...');
        
        try {
            const currentWeather = game.weatherSystem.getCurrentWeather();
            const climateInfo = game.weatherSystem.getActiveClimateInfo();
            
            if (!currentWeather || Object.keys(currentWeather).length === 0) {
                ui.notifications.warn(game.i18n.localize('dynamic-weather-system.notifications.noWeatherToSend'));
                return;
            }
            
            // Render the chat template
            const template = 'modules/dynamic-weather-system/templates/chat-weather.hbs';
            const templateData = {
                currentWeather,
                climateInfo
            };
            
            const content = await renderTemplate(template, templateData);
            
            // Create chat message
            await ChatMessage.create({
                user: game.user.id,
                speaker: ChatMessage.getSpeaker({ alias: game.i18n.localize('dynamic-weather-system.ui.title') }),
                content: content,
                type: CONST.CHAT_MESSAGE_TYPES.OTHER
            });
            
            console.log('WeatherUI | Weather sent to chat successfully');
            ui.notifications.info(game.i18n.localize('dynamic-weather-system.notifications.weatherSentToChat'));
            
        } catch (error) {
            console.error('WeatherUI | Error sending weather to chat:', error);
            ui.notifications.error(game.i18n.localize('dynamic-weather-system.notifications.errorSendingToChat'));
        }
    }

    async _onSetInitialDate(event) {
        console.log('WeatherUI | Setting initial date...');
        
        new Dialog({
            title: game.i18n.localize('dynamic-weather-system.ui.dialogs.setInitialDate.title'),
            content: `
                <form class="weather-override-dialog">
                    <div class="form-group">
                        <label>${game.i18n.localize('dynamic-weather-system.ui.dialogs.setInitialDate.label')}</label>
                        <input type="date" name="initialDate" value="${new Date().toISOString().split('T')[0]}">
                    </div>
                </form>
            `,
            buttons: {
                apply: {
                    label: game.i18n.localize('dynamic-weather-system.ui.buttons.apply'),
                    callback: async (html) => {
                        const selectedDate = html.find('input[name="initialDate"]').val();
                        game.weatherSystem.setInitialDate(selectedDate);
                        console.log('WeatherUI | Initial date set to:', selectedDate);
                    }
                },
                cancel: {
                    label: game.i18n.localize('dynamic-weather-system.ui.buttons.cancel')
                }
            },
            default: 'apply'
        }, {
            resizable: true,
            cssClass: 'dynamic-weather-dialog'
        }).render(true);
    }

    async _onCycleTimeOfDay(event) {
        console.log('WeatherUI | Cycling time of day...');
        
        try {
            const timeOfDayOrder = ['night', 'morning', 'afternoon', 'evening'];
            const currentWeather = game.weatherSystem.getCurrentWeather();
            
            if (!currentWeather || !currentWeather.timeOfDay) {
                return;
            }
            
            // Fix: Ensure currentWeather.date is a Date object
            if (currentWeather.date && !(currentWeather.date instanceof Date)) {
                currentWeather.date = new Date(currentWeather.date);
            }
            
            const currentIndex = timeOfDayOrder.indexOf(currentWeather.timeOfDay);
            const nextIndex = (currentIndex + 1) % timeOfDayOrder.length;
            const nextTimeOfDay = timeOfDayOrder[nextIndex];
            
            // Generate new weather for the new time of day
            const updatedWeather = game.weatherSystem.generateWeatherForTimeOfDay(currentWeather, nextTimeOfDay);
            
            // Save the updated weather
            await game.weatherSystem.setWeather(updatedWeather);
            
            // Refresh the panel
            this.render();
            
            console.log(`WeatherUI | Time of day changed to: ${nextTimeOfDay}`);
            
        } catch (error) {
            console.error('WeatherUI | Error cycling time of day:', error);
        }
    }

    async _onAdvanceDay(event) {
        console.log('WeatherUI | Advancing day...');
        
        try {
            // Get current weather or use initial date
            let currentDate;
            const currentWeather = game.weatherSystem.getCurrentWeather();
            
            if (currentWeather && currentWeather.date) {
                // Advance from current weather date
                currentDate = new Date(currentWeather.date);
                currentDate.setDate(currentDate.getDate() + 1);
            } else {
                // Use initial date or current date
                currentDate = game.weatherSystem.getCurrentGameDate();
            }
            
            const newWeather = game.weatherSystem.generateWeatherForClimate(currentDate);
            
            if (newWeather) {
                game.weatherSystem.currentWeather = newWeather;
                game.weatherSystem.addToHistory(newWeather);
                await game.weatherSystem.saveWeatherData();
                
                // Broadcast weather update
                if (game.user.isGM) {
                    game.socket.emit('module.dynamic-weather-system', {
                        type: 'weatherUpdate',
                        weather: newWeather
                    });
                }
            }
            
            // Refresh the panel to show new weather
            this.render();
            
            console.log('WeatherUI | New weather generated for date:', currentDate);
            
        } catch (error) {
            console.error('WeatherUI | Error advancing day:', error);
        }
    }

    async _onOverrideWeather(event) {
        new WeatherOverrideDialog().render(true);
    }

    async _onProbabilityChange(event) {
        const eventType = event.target.dataset.event;
        const value = parseFloat(event.target.value) / 100; // Convert percentage to decimal
        
        if (!game.weatherSystem.settings.eventProbabilities) {
            game.weatherSystem.settings.eventProbabilities = {};
        }
        
        game.weatherSystem.settings.eventProbabilities[eventType] = value;
        
        // Update the display value
        const valueSpan = event.target.parentElement.querySelector('.probability-value');
        if (valueSpan) {
            valueSpan.textContent = Math.round(value * 100) + '%';
        }
        
        console.log(`WeatherUI | Updated ${eventType} probability to ${Math.round(value * 100)}%`);
    }

    async _onResetProbability(event) {
        const eventType = event.target.dataset.event;
        const defaultValue = parseFloat(event.target.dataset.default) / 100;
        
        if (!game.weatherSystem.settings.eventProbabilities) {
            game.weatherSystem.settings.eventProbabilities = {};
        }
        
        game.weatherSystem.settings.eventProbabilities[eventType] = defaultValue;
        
        // Update the slider and display
        const slider = event.target.parentElement.querySelector('.probability-slider');
        const valueSpan = event.target.parentElement.querySelector('.probability-value');
        
        if (slider) slider.value = Math.round(defaultValue * 100);
        if (valueSpan) valueSpan.textContent = Math.round(defaultValue * 100) + '%';
        
        await game.weatherSystem.saveWeatherData();
        
        console.log(`WeatherUI | Reset ${eventType} probability to ${Math.round(defaultValue * 100)}%`);
    }

    async _onResetAllProbabilities(event) {
        // OBTER PADRÕES DIRETAMENTE DA CONFIGURAÇÃO REGISTRADA
        const defaultSettings = game.settings.settings.get('dynamic-weather-system.weatherSettings').default;
        const defaultProbabilities = defaultSettings.eventProbabilities;
        
        game.weatherSystem.settings.eventProbabilities = { ...defaultProbabilities };
        await game.weatherSystem.saveWeatherData();
        this.render();
        
        console.log('WeatherUI | Reset all probabilities to registered defaults:', defaultProbabilities);
    }

    async _onSaveSettings(event) {
        await game.weatherSystem.saveWeatherData();
        console.log('WeatherUI | Settings saved:', game.weatherSystem.settings.eventProbabilities);
    }

    async _onViewHistory(event) {
        new WeatherHistoryDialog().render(true);
    }

    async _onChangeClimate(event) {
        new ClimateSelectionDialog().render(true);
    }
}

class WeatherOverrideDialog extends Dialog {
    constructor() {
        const currentWeather = game.weatherSystem.getCurrentWeather();
        const today = game.weatherSystem.getCurrentGameDate();
        
        super({
            title: game.i18n.localize('dynamic-weather-system.ui.dialogs.weatherOverride.title'),
            content: `
                <form class="weather-override-dialog">
                    <div class="form-group">
                        <label>${game.i18n.localize('dynamic-weather-system.ui.labels.date')}:</label>
                        <input type="date" name="date" value="${currentWeather?.date ? new Date(currentWeather.date).toISOString().split('T')[0] : today.toISOString().split('T')[0]}">
                    </div>
                    <div class="form-group">
                        <label>${game.i18n.localize('dynamic-weather-system.ui.labels.temperature')} (°C):</label>
                        <input type="number" name="temperature" value="${currentWeather?.temperature || 15}" step="0.1">
                    </div>
                    <div class="form-group">
                        <label>${game.i18n.localize('dynamic-weather-system.ui.labels.precipitation')}:</label>
                        <select name="precipitation">
                            <option value="none" ${currentWeather?.precipitation === 'none' ? 'selected' : ''}>${game.i18n.localize('dynamic-weather-system.ui.weatherTypes.none')}</option>
                            <option value="drizzle" ${currentWeather?.precipitation === 'drizzle' ? 'selected' : ''}>${game.i18n.localize('dynamic-weather-system.ui.weatherTypes.drizzle')}</option>
                            <option value="rain" ${currentWeather?.precipitation === 'rain' ? 'selected' : ''}>${game.i18n.localize('dynamic-weather-system.ui.weatherTypes.rain')}</option>
                            <option value="heavy-rain" ${currentWeather?.precipitation === 'heavy-rain' ? 'selected' : ''}>${game.i18n.localize('dynamic-weather-system.ui.weatherTypes.heavy-rain')}</option>
                            <option value="snow" ${currentWeather?.precipitation === 'snow' ? 'selected' : ''}>${game.i18n.localize('dynamic-weather-system.ui.weatherTypes.snow')}</option>
                            <option value="sleet" ${currentWeather?.precipitation === 'sleet' ? 'selected' : ''}>${game.i18n.localize('dynamic-weather-system.ui.weatherTypes.sleet')}</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>${game.i18n.localize('dynamic-weather-system.ui.labels.timeOfDay')}:</label>
                        <select name="timeOfDay">
                            <option value="morning" ${currentWeather?.timeOfDay === 'morning' ? 'selected' : ''}>${game.i18n.localize('dynamic-weather-system.ui.timeOfDay.morning')}</option>
                            <option value="afternoon" ${currentWeather?.timeOfDay === 'afternoon' ? 'selected' : ''}>${game.i18n.localize('dynamic-weather-system.ui.timeOfDay.afternoon')}</option>
                            <option value="evening" ${currentWeather?.timeOfDay === 'evening' ? 'selected' : ''}>${game.i18n.localize('dynamic-weather-system.ui.timeOfDay.evening')}</option>
                            <option value="night" ${currentWeather?.timeOfDay === 'night' ? 'selected' : ''}>${game.i18n.localize('dynamic-weather-system.ui.timeOfDay.night')}</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>${game.i18n.localize('dynamic-weather-system.ui.labels.windSpeed')} (km/h):</label>
                        <input type="number" name="windSpeed" value="${currentWeather?.windSpeed || 10}" step="0.1">
                    </div>
                    <div class="form-group">
                        <label>${game.i18n.localize('dynamic-weather-system.ui.labels.visibility')} (km):</label>
                        <input type="number" name="visibility" value="${currentWeather?.visibility || 10}" step="0.1">
                    </div>
                    <div class="form-group">
                        <label>${game.i18n.localize('dynamic-weather-system.ui.labels.humidity')} (%):</label>
                        <input type="number" name="humidity" value="${currentWeather?.humidity || 50}" min="0" max="100">
                    </div>
                </form>
            `,
            buttons: {
                apply: {
                    label: game.i18n.localize('dynamic-weather-system.ui.buttons.apply'),
                    callback: async (html) => {
                        const formData = new FormData(html.find('form')[0]);
                        const selectedDate = new Date(formData.get('date'));
                        
                        const weatherData = {
                            climate: game.weatherSystem.activeClimate,
                            date: selectedDate,
                            temperature: parseFloat(formData.get('temperature')),
                            precipitation: formData.get('precipitation'),
                            precipitationIntensity: formData.get('precipitation') !== 'none' ? 0.5 : 0,
                            windSpeed: parseFloat(formData.get('windSpeed')),
                            windDirection: Math.floor(Math.random() * 360),
                            visibility: parseFloat(formData.get('visibility')),
                            humidity: parseInt(formData.get('humidity')),
                            pressure: 1013,
                            events: [],
                            season: game.weatherSystem.getSeason(selectedDate),
                            timeOfDay: formData.get('timeOfDay')
                        };
                        
                        await game.weatherSystem.setWeather(weatherData);
                        
                        if (game.weatherUI.app) {
                            game.weatherUI.app.render();
                        }
                    }
                },
                cancel: {
                    label: game.i18n.localize('dynamic-weather-system.ui.buttons.cancel')
                }
            },
            default: 'apply'
        }, {
            resizable: true,
            cssClass: 'dynamic-weather-dialog'
        });
    }
}

class WeatherHistoryDialog extends Application {
    constructor() {
        super();
    }

    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            id: 'weather-history-dialog',
            title: game.i18n.localize('dynamic-weather-system.ui.dialogs.weatherHistory.title'),
            template: 'modules/dynamic-weather-system/templates/weather-history.hbs',
            resizable: true,
            cssClass: 'dynamic-weather-dialog'
        });
    }

    getData() {
        const climateInfo = game.weatherSystem.getActiveClimateInfo();
        const history = game.weatherSystem.getWeatherHistory().slice(-60); // Last 60 days
        const statistics = game.weatherSystem.getWeatherStatistics(60);

        return {
            climateInfo,
            history,
            statistics
        };
    }
}
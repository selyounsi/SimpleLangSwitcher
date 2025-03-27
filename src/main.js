/**
 * @name SimpleLangSwitcher
 * @desc A lightweight JavaScript class for dynamic multilingual navigation links based on page mapping.
 * @author s.elyounsi
 * @version 1.0.0
 * @date 26.03.2025
*/
class SimpleLangSwitcher 
{
    constructor(selector, options) 
    {
        this.version    = "1.0.0"; 
        this.name       = "SimpleLangSwitcher"; 

        this.selector   = document.querySelectorAll(selector);
        this.lang       = document.documentElement.lang.split(/[-_]/)[0].toLowerCase()
        this.path       = document.location.pathname;
        this.cache      = 86400; // 24h

        this.options    = {
            defaultLang: "en",
            shortName: false,
            title: false,
            listClass: 'lang-switcher',
            translation: {
                de: {
                    languageChoice: 'Sprachauswahl',
                    languageSwitchText: 'Diese Seite in {{lang}} anzeigen',
                    languages: {
                        de: "Deutsch",
                        en: "Englisch",
                        pl: "Polnisch",
                        fr: "Französisch",
                        ru: "Russisch",
                        es: "Spanisch",
                        it: "Italienisch"
                    }
                },
                en: {
                    languageChoice: 'Language selection',
                    languageSwitchText: 'Display this page in {{lang}}',
                    languages: {
                        de: "German",
                        en: "English",
                        pl: "Polish",
                        fr: "French",
                        ru: "Russian",
                        es: "Spanish",
                        it: "Italian"
                    }
                },
                pl: {
                    languageChoice: 'Wybór języka',
                    languageSwitchText: 'Wyświetl tę stronę w {{lang}}',
                    languages: {
                        de: "Niemiecki",
                        en: "Angielski",
                        pl: "Polski",
                        fr: "Francuski",
                        ru: "Rosyjski",
                        es: "Hiszpański",
                        it: "Włoski"
                    }
                },
                fr: {
                    languageChoice: 'Choix de la langue',
                    languageSwitchText: 'Afficher cette page en {{lang}}',
                    languages: {
                        de: "Allemand",
                        en: "Anglais",
                        pl: "Polonais",
                        fr: "Français",
                        ru: "Russe",
                        es: "Espagnol",
                        it: "Italien"
                    }
                },
                ru: {
                    languageChoice: 'Выбор языка',
                    languageSwitchText: 'Отображать эту страницу на {{lang}}',
                    languages: {
                        de: "Немецкий",
                        en: "Английский",
                        pl: "Польский",
                        fr: "Французский",
                        ru: "Русский",
                        es: "Испанский",
                        it: "Итальянский"
                    }
                },
                es: {
                    languageChoice: 'Selección de idioma',
                    languageSwitchText: 'Mostrar esta página en {{lang}}',
                    languages: {
                        de: "Alemán",
                        en: "Inglés",
                        pl: "Polaco",
                        fr: "Francés",
                        ru: "Ruso",
                        es: "Español",
                        it: "Italiano"
                    }
                },
                it: {
                    languageChoice: 'Selezione della lingua',
                    languageSwitchText: 'Mostra questa pagina in {{lang}}',
                    languages: {
                        de: "Tedesco",
                        en: "Inglese",
                        pl: "Polacco",
                        fr: "Francese",
                        ru: "Russo",
                        es: "Spagnolo",
                        it: "Italiano"
                    }
                }
            }          
        }

        this.settings = this.merge(this.options, options);
        this.init();   
    }

    /**
     * INITIALIZE LANG SWITCHER 
     */
    async init() 
    {
        console.log(this.getTranslation("languages.de"))
        if(this.errorCheck(this.settings.mapping)) 
        {
            this.mapping();
        }
    }

    /**
     * CHECK MAPPING SETTINGS
     * 
     * @param object mapping 
     * @returns 
     */
    errorCheck(mapping) 
    {    
        // Prüft ob mapping vorhanden ist
        if(!mapping) 
        {
            this.errorMessage("Mapping Fehlt!");
            return false;
        }
        // Prüft ob mapping Sprachen enthält
        if(Object.keys(mapping).length === 0) 
        {
            this.errorMessage("Keine Sprachen vorhanden!");
            return false;
        }
        // Prüft ob Links in den Sprachen vorhanden sind
        for (let lang in mapping) 
        {
            if(Object.keys(mapping[lang]).length === 0) 
            {
                this.errorMessage(`Die Sprache (${lang.toUpperCase()}) hat keine Links!`);
                return false;
            }
            // Prüft ob die Idents strings sind
            for (let pfad in mapping[lang]) 
            {
                if(typeof mapping[lang][pfad] === 'string') 
                {
                    this.errorMessage(`Folgender IDENT <b>(${lang.toUpperCase()} -> ${pfad} ->  ${mapping[lang][pfad]})</b> als Zahl angeben!`);
                    return false;
                }
            }
        }
        return true;        
    }

    /**
     * GET ERROR MESSAGE
     * @param string message 
     */
    errorMessage(message) 
    {
        console.log(`%c${message}`, 'color: red; font-weight: bold;');
    }

    /**
     * MAPPING LINKS
     */
    async mapping() 
    {
        let self = this;

        let links = {}, ident;
        let idents = this.settings.mapping;
        let current = idents[this.lang];

        // create default links
        for (let lang in idents) 
        {
            links[lang] = {
                path: self.settings.defaultLang == lang ? `/` : `/${lang}/`,
                title: lang
            };
        }

        // current lang
        for (let key in current) 
        {
            if(key === self.path) 
            {
               links[self.lang].path = key;
               links[self.lang].title = await self.getPageTitle(self.lang, key);
               ident = current[key];
            }
        }

        // other lang
        delete idents[self.lang];
        for (let lang in idents) 
        {
            for (let key in idents[lang]) 
            {
                if(idents[lang][key] === ident) 
                {
                    links[lang].path = key;
                    links[lang].title = await self.getPageTitle(lang, key);
                }
            }
        }     

        // CREATE LIST AND MODIFY CONTAINER
        self.selector.forEach((selector) => 
        {   
            selector.role = "navigation";
            selector.ariaLabel = this.getTranslation("languageChoice");

            self.createList(selector, links);
        })
    }

    /**
     * GET PAGE TITLE
     * 
     * @param string lang 
     * @param string path 
     * @returns 
     */
    async getPageTitle(lang, path) 
    {
        let title = this.getTranslation(`languages.${lang}`);
        if(this.settings.title) 
        {
            let link = await this.getHTML(path);
            if(link.title) {
                title = link.title;
            }
        }

        return title;
    }

    /**
     * CREATE LINKS
     * 
     * @param object map 
     * @returns 
     */
    createLinks(map) 
    {
        let self = this;
        let links = {};

        for (const [key, value] of Object.entries(map)) 
        {   
            let link        = document.createElement('a'); 
            link.title      = value.title;
            link.innerText  = key; 
            link.href       = value.path; 
            link.tabIndex   = 0;
            link.ariaLabel  = this.getTranslation(`languageSwitchText`, {lang: this.getTranslation(`languages.${key}`)})
            link.lang       = key;    
            link.hreflang   = key;      

            if(key === this.lang) 
            {
                link.setAttribute("aria-current", "page")
            }

            links[key] = link;
        }

        return links;
    }

    /**
     * CREATE LIST
     * 
     * @param object selector 
     * @param object links 
     */
    createList(selector, links) 
    {
        let newUl = document.createElement('ul'); 
        let oldUl = selector.getElementsByClassName(this.settings.listClass)[0];
        newUl.className = `${this.settings.listClass} page-${this.lang}`;

        oldUl ? oldUl.remove() : null;
        selector.appendChild(newUl);

        for (const [key, value] of Object.entries(this.createLinks(links))) 
        {       
            let li = document.createElement('li');
            li.className = key;

            if(this.settings.shortName) 
            {
                value.innerText = key;
            }

            if(key === this.lang) 
            {
                li.classList.add("active"); 
            }

            li.appendChild(value); 
            newUl.appendChild(li);
        }

        console.log(`%c${this.name} ${this.version} wurde erfolgreich ausgeführt!`, 'color: green; font-weight: bold;');
    }

    /**
     * fetch any content from a page
     * @param  {string}   url         url to fetch from       
     * @param  {Function} callback callable with response object as argument
     * @return {void}
     */
    async asyncGet(url) 
    {
        return fetch(url, {
            headers: {
                "Cache-Control": `max-age=${this.cache}`
            }
      });
    }

    /**
     * fetch HTML content from a page
     * @param  {string}   url         url to fetch from       
     * @param  {Function} callback callable with parsed html document and response object as arguments
     * @return {void}
     */
    async getHTML(url) 
    {
        return this.asyncGet(url).then(response => response.text())
        .then(text => 
        {
            const parser = new DOMParser();
            const htmlDoc = parser.parseFromString(text, 'text/html');
            return htmlDoc;
        });
    }

    /**
     * Retrieves the translation for the provided key in the current language, falling back to "en" if the translation is not available.
     * @param {string} key - The key for which the translation is needed.
     * @param {Object} [placeholders={}] - An optional object containing placeholder values to replace in the translation string.
     * @param {string} [service=""] - The optional service identifier if the translation belongs to a specific service.
     * @returns {string} - The translated string for the specified key with placeholders replaced.
     */
    getTranslation(key, placeholders = {}) 
    {
        // Determine the translation object based on the service identifier, if provided
        let translation = this.settings.translation;

        // Check if the current language has translations
        if (this.lang in translation) {

            // Split the key into nested keys
            const keys = key.split('.');

            // Traverse through the nested keys to get the final translation
            let translatedText = translation[this.lang];
            for (let nestedKey of keys) {
                translatedText = translatedText[nestedKey];
                if (!translatedText) break; // If at any level the translation is not found, break
            }
    
            // Replace placeholders in the translated text with values from the placeholders object
            for (let placeholder in placeholders) {
                translatedText = translatedText.replace(`{{${placeholder}}}`, placeholders[placeholder]);
            }
    
            return translatedText;

        }
        // Return the translation for the key in English, or the key itself if not found
        return (translation["en"] !== undefined && translation["en"].hasOwnProperty(key) ? translation["en"][key] : key);
    }

    /**
     * @name merge
     * 
     * @param  {...any} objects 
     * @returns Merged Object
     */
    merge(...objects) {
        // create a new object
        let target = {}
      
        // deep merge the object into the target object
        const merger = obj => {
          for (let prop in obj) {
            if (obj.hasOwnProperty(prop)) {
              if (Object.prototype.toString.call(obj[prop]) === '[object Object]') {
                // if the property is a nested object
                target[prop] = this.merge(target[prop], obj[prop])
              } else {
                // for regular property
                target[prop] = obj[prop]
              }
            }
          }
        }
      
        // iterate through all objects and
        // deep merge them with target
        for (let i = 0; i < objects.length; i++) {
          merger(objects[i])
        }
        return target
    }
}
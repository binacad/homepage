
customElements.define('skill-entry', class SkillEntry extends HTMLElement {
    render() {
        const root = this.attachShadow({mode: 'open'});

        const name = String(this.getAttributeNode('name').value);
        const level = parseInt(this.getAttributeNode('level').value);

        let skillContainer = document.createElement('div');
        let skillTitle = document.createElement('div');
        let skillScale = document.createElement('div');

        this.applyStyles();

        skillContainer.className = 'skill_entry';
        skillTitle.className = 'skill_title';
        skillScale.className = 'skill_scale';
        skillTitle.innerHTML = name;

        for (let i = 1; i <= 10; ++i) {
            let bread = document.createElement('div');
            bread.className = 'skill_scale_item';

            if (i <= level) {
                bread.className += ' filled';
            }

            skillScale.append(bread);
        }

        skillContainer.append(skillTitle);
        skillContainer.append(skillScale);
        root.append(skillContainer);
    }

    applyStyles() {
        const sheet = new CSSStyleSheet();
        sheet.replaceSync(`
            .skill_entry {
                border-radius: 5px;
                padding: 5px;
                transition: background .3s;
            }
            .skill_entry:hover {
                background: violet;
            }
            .skill_entry:hover .skill_title {
                color: yellow;
            }

            .skill_entry .skill_scale .skill_scale_item {
                display: inline-block;
                height: 10px;
                width: 35px;
                border-radius: 2px;
                background: white;
                content: "";
            }
            .skill_entry:hover .skill_scale .skill_scale_item.filled {
                background: yellow;
            }

            .skill_entry .skill_scale .skill_scale_item {
                background: white;
                border: 1px solid black;
                margin-right: 3px;
            }

            .skill_entry .skill_scale .skill_scale_item:last-child {
                margin-right: 0;
            }
            .skill_entry .skill_scale .skill_scale_item.filled {
                background: black;
            }
        `);

        this.shadowRoot.adoptedStyleSheets.push(sheet);
    }

    constructor() {
        super()
    }

    connectedCallback() { 
        if (!this.rendered) {
            this.render();
            this.rendered = true;
        }
    }
});

customElements.define('exclusive-spoiler', class ExclusiveSpoiler extends HTMLElement {
    render() {
        setTimeout(() => {
            const children = this.children;

            const root = this.attachShadow({mode: 'open'});
            const sharedSpoilerClass = this.getAttributeNode('shared_class');

            this.applyStyles();
            root.openedSpoilers = [];

            // if (sharedSpoilerClass) {
            //     this.setupSharedSpoilerByClass(sharedSpoilerClass);
            //     return;
            // }

            if (children) {
                for (const item of children) {
                    const spoiler = document.createElement('div');
                    const title = document.createElement('div');
                    const icon = document.createElement('div');
                    const title_text = document.createElement('div');
                    const content = document.createElement('div');
                    let subtitles;


                    title_text.innerHTML = item.getElementsByTagName('title')[0].textContent;
                    content.innerHTML = item.getElementsByTagName('content')[0].innerHTML;

                    const sublist = Array.from(item.getElementsByTagName('subtitle'));
 
                    spoiler.className = 'spoiler_element';
                    icon.className = 'icon';
                    title.className = 'header';
                    content.className = 'content';
                   
                    title.append(icon, title_text)
                    spoiler.append(title);
                    if (sublist.length) {
                        subtitles = document.createElement('div');
                        sublist.forEach((sub) => {
                            const t = document.createElement('div');
                            t.innerHTML = sub.textContent;
                            t.className = 'subtitle';
                            subtitles.append(t);
                        });
                        subtitles.className = 'subtitles';
                        spoiler.append(subtitles);
                    }
                    spoiler.append(content);

                    root.append(spoiler)
                }
            }

            this.replaceChildren()
            root.addEventListener('click', this.handleClick);

        });
    }

    applyStyles() {
        const styles = new CSSStyleSheet();
        styles.replaceSync(`
            .spoiler_element {
                display: flex;
                flex-direction: column;
                padding: 5px;
                margin-bottom: 5px;
                border-radius: 3px;
                // border: 1px solid black;
                transition: background .3s;
            }
            .spoiler_element:hover {
                background: rgba(75, 110, 175, .4);
            }
            .spoiler_element .header {
                display: flex;
                align-items: center;
                border-radius: 5px 5px 0 0;
                // border-bottom: 1px solid black;
                padding: 15px;
                cursor: pointer;
            }
            .spoiler_element:hover .header {
                // background: rgba(77, 77, 170, .5);
                color: rgba(0, 70, 289, .8);
            }
            .spoiler_element .header div {
                display: inline-block;
            }
            .spoiler_element .subtitles {
                display: block;
                // border-left: 1px solid black;
                border-bottom: 2px solid black;
                margin: 5px 0;
                padding: 15px;
            }
            .spoiler_element .header .icon {
                width: 0; 
                height: 0; 
                border-top: 7px solid transparent;
                border-bottom: 7px solid transparent; 
                border-left: 11px solid;
                border-right: 7px solid transparent;

                /* borders: left + right = 19 */
            }
            .spoiler_element.opened .header .icon {
                border-left: 7px solid transparent;
                border-right: 7px solid transparent;
                border-top: 11px solid black;
                border-bottom: none;
                margin-right: 4px; /* right + left = 14px */
                margin-top: 2px;
            }
            .spoiler_element .header .text {
                margin-left: 5px;
            }
            .spoiler_element .content {
                max-height: 0px;
                overflow: hidden;
                transition: max-height .4s ;
            }
            .spoiler_element.opened .content {
                padding: 5px;
                border: 1px solid black;
            }
        `);
        this.shadowRoot.adoptedStyleSheets.push(styles)
    }

    // setupSharedSpoilerByClass(sharedClass) {
    //     const spoilers = document.querySelectorAll(sharedClass);
    //     if (!lastUsedByClass[sharedClass] ) {
    //         openedListByClass[sharedClass] = [];
    //     }
    // }

    handleClick(e) {
        const checkOnly = 3;
        const elements = e.composedPath();
        let header = null;

        for (let i = 0; i < checkOnly; ++i) {
            const classes = elements[i].classList;

            if (classes && classes.contains('header')) {
                header = elements[i];
                break;
            }
        }

        if (!header) {
            return;
        }

        const spoiler = header.parentNode;
        const wasOpened = spoiler.classList.contains('opened');

        this.openedSpoilers.forEach((el) => {
            el.classList.remove('opened')
            el.getElementsByClassName('content')[0].style.maxHeight = '0';
        });
        this.openedSpoilers = [];

        if (!wasOpened) {
            spoiler.classList.add('opened');
            const content = spoiler.getElementsByClassName('content')[0];
            content.style.maxHeight = content.scrollHeight+ 'px';
            this.openedSpoilers.push(spoiler);
        }
    }

    constructor() {
        super()
    }

    connectedCallback() {
        if (!this.rendered) {
            this.render();
            this.rendered = true;
        }
    }
});


customElements.define('experience-timeline', class ExperienceTimeline extends HTMLElement {
    render() {
        const root = this.attachShadow({mode: 'open'});
        // const expEntry = docuement.createElement('div');

        // for (const item of this.children) {
        //     const container = docuement.createElement('div');
        //     const header = document.createElement('div');

        //     container.className = 'exp_entry';
        // }

        this.applyStyles()
    }

    applyStyles() {
        const sheets = new CSSStyleSheet();
        sheets.replaceSync(`
            .exp_entry {
                display: flex;
                box-shadow: 1px 1px 3px 3px black;
                border-bottom: 1px solid gold;
                margin-bottom: 10px;
                padding: 5px;
            }

            .exp_entry .exp_header {

            }
            .exp_entry .header .exp_company {

            }
            .exp_entry .header .exp_job_title {

            }
            .exp_entry .exp_timespan {

            }
            .exp_entry .focal_points {

            }
            .exp_entry .extended_description {

            }
        `);
        this.shadowRoot.adoptedStyleSheets.push(sheets);
    }

    constructor() {
        super()
    }

    connectedCallback() {
        if (!this.rendered) {
            this.reneder();
            this.rendered = true;
        }
    }
});
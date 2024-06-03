const items = [
    { name: "home",     ref: "/",               title: "Home"     },
    { name: "resume",   ref: "/pages/resume",   title: "Resume"   },
    { name: "blog",     ref: "/pages/blog",     title: "Blog"     },
    { name: "projects", ref: "/pages/projects", title: "Projects" },
];

class HeaderNavigatoin extends HTMLElement {
    render() {
        this.style.visibility = 'none';
        setTimeout(() => {
            let container = document.createElement('div');
            let itemsContainer = document.createElement('div'); 
            const selectedId = this.getAttributeNode('selected').value;

            container.className = "page_header_block";
            itemsContainer.className = "page_header_container";

            for (const it of items) {
                let item = document.createElement('div');

                item.innerHTML = it['title'];
                item.className = "page_header_item";
                item.addEventListener('click', onNavigationFollow);
                item.refData = it['ref'];

                if (selectedId == it['name']) {
                    item.className += " page_item_selected"
                    item.isCurrent = true;
                }

                itemsContainer.append(item);
            }

            container.append(itemsContainer);
            this.replaceWith(container);
        });
    }

    constructor() {
        super();
    }

    connectedCallback() { 
        if (!this.rendered) {
            this.render();
            this.rendered = true;
        }
    }
}

function onNavigationFollow() {
    if (this.isCurrent) {
        return;
    } 
    document.location.href = this.refData;
}

customElements.define('header-nav', HeaderNavigatoin);
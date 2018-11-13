# React AutoSearchBox

A simple component for build autocomplete with customized menu.

Handle mouse event, keyboard event and touch event. Reference `Usage` part for detail.

Demo: https://seawind543.github.io/rc-autosearchbox/

## Installation

1. Run `npm install` to install required packages.
2. Run `npm run dev` to launch `webpack-dev-server`.
3. After step 2, you will see following message output in command console.
```
Project is running at http://0.0.0.0:8000/
webpack output is served from /
```

4. It might take some time for webpack to compiled. Please wait for message below output in the command console.
```
webpack: Compiled with warnings.
```

> Note: To stop the program, just type ```ctrl + c``` in command console.

## Usage

### Search

- Focus on the input-box to trigger **search** / **open** the menu.

### Mouse operations

- Click on menu item to select it and display detail information of the App. The selected App will be add into search history after selected.

- Mouse hover on a menu item will ***activated*** it.

- Will ***close*** menu if areas outside are clicked.

- Will ***clear*** value of the input-box, if click on the clear-button (x) of the input-box.

### keyboard operations
When focus on the search-box, and use following keys to make operations.

- **Enter**: 
For `search` or `select` item.

	- Trigger ***search for autocomplete***, in case `No activated item in menu`.
	
	- ***Select current activated item***, in case `Exist an activated item in menu`.
	
- **ArrowDown** and **ArrowUp**: 
For `activated` next item.

	-  Will **display the item's name in search-box** while operation (like Google search). 
	Will open the menu, in case the menu was closed.

	- ***Deactivate items*** and ***rollback search-box's value***,  in case go back to the input-box.
	
	- Could ***loop*** the list and input-box, in case keep trigger/press the key.
	
	- Will auto-scroll the menu's scrollbar, to ensure next item is into view.
	
- **Delete**
For ***deselect the item***, in case the item is `activated`.
	- In case there is `No activated item in menu`, then ***normal delete operation*** for input-box will performed (That is, delete character).

- **Escape**
For ***close*** the menu.

### Render your own itemTemplate

Reference `App` and `SuggestionItem` to know how to use `itemRenderer` props of **AutoSearchBox** to render your own itemTemplate.

- Example (Set render function by `itemRenderer`):
```javascript
<AutoSearchBox
    onSearch={this.actions.handleSearch}
    menuItems={apps}
    getItemDisplayedName={this.actions.getItemDisplayedName}
    getItemUniqueId={this.actions.getItemUniqueId}
    onSelect={this.actions.handleSelectApp}
    onDeselect={this.actions.handleDeselectApp}
    itemRenderer={this.actions.itemRenderer}
/>
```

- Example (Set render function by`children` of `AutoSearchBox`):
```javascript
<AutoSearchBox
    onSearch={this.actions.handleSearch}
    menuItems={apps}
    getItemDisplayedName={this.actions.getItemDisplayedName}
    getItemUniqueId={this.actions.getItemUniqueId}
    onSelect={this.actions.handleSelectApp}
    onDeselect={this.actions.handleDeselectApp}
>
    {(props) => {
        const {
            index,
            isActive,
            item,
            onSelect
        } = props;

        return (
                <div
                    className={classNames(
                        styles.item,
                        { [styles.active]: isActive }
                    )}
                    onClick={(e) => { onSelect(); }}
                    role="presentation"
                >
                    <div className={styles.label}>
                        {item.name}
                    </div>
                </div>
        );
    }}
</AutoSearchBox>
```


## API

```javascript
    className: PropTypes.string,
    style: PropTypes.object,

    // className and style for input-box
    inputClassName: PropTypes.string,
    inputStyle: PropTypes.object,

    // className and style for menu
    menuClassName: PropTypes.string,
    menuStyle: PropTypes.object,

    // placeholder for input-box
    placeholder: PropTypes.string,

    /*
     * Callback invoked when search keywords
     * onSearch(keyword)
     *
     * @ keyword
     * Type: string
     * Description: keyword for search
     */
    onSearch: PropTypes.func.isRequired,

    // The number of milliseconds to throttle call onSearch callBack
    throttle: PropTypes.number,

    // Array of autocomplete list item's data
    menuItems: PropTypes.arrayOf(PropTypes.object),

    /*
     * function for get autocomplete list item's displayed name
     * getItemDisplayedName(itemData)
     *
     * @ itemData
     * Type: object
     * Description: The item object in menuItems
     */
    getItemDisplayedName: PropTypes.func.isRequired,

    /*
     * function for get autocomplete list item's unique id for render (as key)
     * getItemUniqueId(itemData)
     *
     * @ itemData
     * Type: object
     * Description: The item object in menuItems
     */
    getItemUniqueId: PropTypes.func.isRequired,

    /*
     * A "plan B" row renderer for rendering a autocomplete list item
     * By Default, will take 'children' prop to make render if children is a function
     * itemRenderer(props)
     *
     * @ props.index
     * Type: number
     * Description: The array index of target item in list (start from 0)
     *
     * @ props.isActive
     * Type: bool
     * Description: Specific target item is active or not
     *
     * @ props.item
     * Type: object
     * Description: Target item's data (The item object in items)
     *
     * @ props.onActive
     * Type: function
     * Description: Callback invoked when item is activated
     *
     * @ props.onSelect
     * Type: function
     * Description: Callback invoked when item selected
     *
     * @ props.onDeselect
     * Type: function
     * Description: Callback invoked when item deselected
     */
    itemRenderer: PropTypes.func,

    /*
     * Callback invoked when a item is selected
     * onSelect(itemData)
     *
     * @ itemData
     * Type: object
     * Description: The item object in menuItems
     */
    onSelect: PropTypes.func,

    /*
     * Callback invoked when a item is deselected
     * onDeselect(itemData)
     *
     * @ itemData
     * Type: object
     * Description: The item object in menuItems
     */
    onDeselect: PropTypes.func
```

## License

[MIT](https://github.com/seawind543/rc-autosearchbox/blob/master/LICENSE)
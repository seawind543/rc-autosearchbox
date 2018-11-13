import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import _throttle from 'lodash/throttle';
import classNames from 'classnames';
import RootCloseWrapper from './components/RootCloseWrapper';
import Input from './components/Input';
import Menu from './components/Menu';

import styles from './styles.styl';

const noActiveItemIndex = -1;

class AutoSearchBox extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            displayedValue: '',
            inputValue: '',
            openMenu: false,
            activeIndex: noActiveItemIndex,
            scrollActiveItemIntoView: false
        };

        // To avoid make autocomplete search to sensitive:
        // 1. Apply throttle function from lodash
        // 2. Do not re-search again when keywords are same as last time
        const {
            onSearch,
            throttle
        } = this.props;
        this.search = _throttle(onSearch, throttle);
        this.searchedValue = null;
    }

    status = {
        isMenuItemActived: () => {
            return this.state.activeIndex !== noActiveItemIndex;
        },
        shouldOpenMenu: () => {
            const {
                menuItems
            } = this.props;
            return this.state.openMenu && menuItems.length > 0;
        }
    }

    actions = {
        handleSeach: (keywords, openMenu = true) => {
            this.setState({
                openMenu,
                displayedValue: keywords,
                inputValue: keywords,
                activeIndex: noActiveItemIndex
            }, () => {
                if (keywords !== this.searchedValue) {
                    this.searchedValue = keywords;
                    this.search(keywords);
                }
            });
        },
        closeMenu: () => {
            this.setState({
                openMenu: false,
                activeIndex: noActiveItemIndex
            });
        },
        updateActiveIndex: (activeIndex = noActiveItemIndex, options = {}) => {
            const { menuItems } = this.props;
            const { displayedValue, inputValue } = this.state;
            const {
                scrollIntoView = false,
                updateDisplayedValue = false
            } = options;
            let newDisplayedValue = displayedValue;

            if (activeIndex < noActiveItemIndex) {
                activeIndex = menuItems.length - 1;
            }

            if (activeIndex >= menuItems.length) {
                activeIndex = noActiveItemIndex;
            }

            if (updateDisplayedValue === true) {
                const activeItem = menuItems[activeIndex];
                if (activeItem) {
                    newDisplayedValue = this.props.getItemDisplayedName(activeItem);
                } else {
                    newDisplayedValue = inputValue;
                }
            }

            this.setState({
                openMenu: true,
                activeIndex,
                displayedValue: newDisplayedValue,
                scrollActiveItemIntoView: scrollIntoView
            });
        },
        handleSelectItem: (item, itemIndex) => {
            const { activeIndex } = this.state;

            if (itemIndex !== activeIndex) {
                /*
                 * Only allow select activated item.
                 * So that, at touch screen (mobile device),
                 * user could active an item by touch it, but not select it.
                 */
                return;
            }

            const displayedName = this.props.getItemDisplayedName(item);

            this.props.onSelect(item);

            // update value and trigger search for new value
            this.actions.handleSeach(displayedName, false);
        },
        handleDeselectItem: (item) => {
            this.props.onDeselect(item);
        },
        handleFocusInput: (e) => {
            const { displayedValue } = this.state;
            this.actions.handleSeach(displayedValue);
        },
        handleInputValue: (e) => {
            const { value = '' } = e.target;

            this.actions.handleSeach(value);
        },
        handleClearInput: (e) => {
            this.actions.handleSeach('');
        },
        handleKeyDown: (e) => {
            let eventKey;

            // https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key
            const eventKeys = [
                'Enter',
                'ArrowDown',
                'ArrowUp',
                'Delete',
                'Escape'
            ];
            const keyIndex = eventKeys.indexOf(e.key);
            eventKey = eventKeys[keyIndex];

            // backward compatibility for browser not support event.key, such as safari
            // https://www.w3schools.com/jsref/event_key_key.asp
            if (eventKey === undefined) {
                eventKey = {
                    13: 'Enter',
                    40: 'ArrowDown',
                    38: 'ArrowUp',
                    46: 'Delete',
                    27: 'Escape'
                }[e.keyCode];
            }

            if (eventKey === 'ArrowDown' || eventKey === 'ArrowUp') {
                // Avoid cursor move
                e.preventDefault();
            }

            this.actions.handleKeyboardOperation(eventKey);
        },
        handleKeyboardOperation: (eventKey) => {
            const { menuItems } = this.props;
            const { activeIndex, displayedValue } = this.state;
            const activeItem = menuItems[activeIndex];
            const isMenuItemActived = this.status.isMenuItemActived();

            // For case operator for menu
            if (eventKey === 'Enter' && isMenuItemActived === true) {
                this.actions.handleSelectItem(activeItem, activeIndex);
            }

            // For case operator for input-box
            if (eventKey === 'Enter' && isMenuItemActived === false) {
                this.actions.handleSeach(displayedValue);
            }

            if (eventKey === 'ArrowDown') {
                this.actions.updateActiveIndex(activeIndex + 1, {
                    scrollIntoView: true,
                    updateDisplayedValue: true
                });
            }

            if (eventKey === 'ArrowUp') {
                this.actions.updateActiveIndex(activeIndex - 1, {
                    scrollIntoView: true,
                    updateDisplayedValue: true
                });
            }

            // For case operator for menu
            if (eventKey === 'Delete' && isMenuItemActived === true) {
                this.actions.handleDeselectItem(activeItem);
            }

            // if user operations are un-handled key event, then inactive menu item
            if (eventKey === undefined) {
                this.actions.updateActiveIndex();
            }
        },
        handleRootClose: (e) => {
            this.actions.closeMenu();
        }
    };

    render() {
        const {
            className,
            style,
            menuItems,
            itemRenderer,
            getItemUniqueId,
            menuStyle,
            menuClassName,
            inputStyle,
            inputClassName,
            placeholder,
            children
        } = this.props;
        const {
            displayedValue,
            activeIndex,
            scrollActiveItemIntoView
        } = this.state;

        const shouldOpenMenu = this.status.shouldOpenMenu();

        const render = (typeof children === 'function')
            ? children
            : itemRenderer;

        return (
            <RootCloseWrapper
                disabled={!shouldOpenMenu}
                onRootClose={this.actions.handleRootClose}
            >
                <div
                    style={style}
                    className={classNames(
                        className,
                        styles.container
                    )}
                >
                    <Input
                        placeholder={placeholder}
                        style={inputStyle}
                        className={inputClassName}
                        value={displayedValue}
                        onFocus={this.actions.handleFocusInput}
                        onInput={this.actions.handleInputValue}
                        onKeyDown={this.actions.handleKeyDown}
                        onClickClearBtn={this.actions.handleClearInput}
                    />
                    <Menu
                        style={menuStyle}
                        className={menuClassName}
                        open={shouldOpenMenu}
                        items={menuItems}
                        itemRenderer={render}
                        getItemUniqueId={getItemUniqueId}
                        activeIndex={activeIndex}
                        shouldScrollActiveItemIntoView={scrollActiveItemIntoView}
                        updateActiveIndex={this.actions.updateActiveIndex}
                        onSelectItem={this.actions.handleSelectItem}
                        onDeselectItem={this.actions.handleDeselectItem}
                    />
                </div>
            </RootCloseWrapper>
        );
    }
}

AutoSearchBox.propTypes = {
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
};

AutoSearchBox.defaultProps = {
    className: '',
    style: {},

    inputClassName: '',
    inputStyle: {},

    menuClassName: '',
    menuStyle: {},

    throttle: 500,
    menuItems: [],
    onSelect: () => {}, // dummy function
    onDeselect: () => {} // dummy function
};


export default AutoSearchBox;

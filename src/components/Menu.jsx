import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { findDOMNode } from 'react-dom';
import classNames from 'classnames';

import styles from './menu.styl';

class Menu extends PureComponent {
    constructor(props) {
        super(props);

        // items' ref // For scroll item into view
        this.itemNodes = [];
    }

    componentDidUpdate(prevProps) {
        if (prevProps.open === false && this.props.open === true) {
            // is menu from close to open case
            this.actions.scrollMenuToTop();
        } else {
            // Check active item exist and scroll it into view
            this.actions.scrollActiveItemIntoView();
        }
    }

    actions = {
        handleActiveItem: (itemIndex) => () => {
            this.props.updateActiveIndex(itemIndex);
        },
        handleSelectItem: (item, itemIndex) => () => {
            this.props.onSelectItem(item, itemIndex);
        },
        handleDeselectItem: (item, itemIndex) => () => {
            this.props.onDeselectItem(item, itemIndex);
        },
        scrollMenuToTop: () => {
            if (!this.menu) {
                return;
            }

            const menu = findDOMNode(this.menu);
            if (menu) {
                menu.scrollTop = 0;
            }
        },
        // Check active item exist and scroll it into view
        // For handle keyboard operation
        scrollActiveItemIntoView: () => {
            const { activeIndex, shouldScrollActiveItemIntoView } = this.props;

            if (shouldScrollActiveItemIntoView === false) {
                return;
            }

            if (!this.itemNodes) {
                return;
            }

            const targetRef = this.itemNodes[activeIndex];
            if (!targetRef) {
                return;
            }

            const target = findDOMNode(targetRef);
            if (target && target.scrollIntoView) {
                target.scrollIntoView(false);
            }
        }
    }

    render() {
        const {
            className,
            style,
            open,
            items,
            itemRenderer,
            getItemUniqueId,
            activeIndex,
            ...props
        } = this.props;

        // Remove un-render-able props
        delete props.onSelectItem;
        delete props.onDeselectItem;
        delete props.updateActiveIndex;
        delete props.shouldScrollActiveItemIntoView;

        return (
            <div
                ref={(node => {
                    this.menu = node;
                })}
                {...props}
                style={style}
                className={classNames(
                    className,
                    styles.container,
                    { [styles.opened]: open }
                )}
            >
                {
                    items.map((item, index) => {
                        let row = null;
                        const isActive = activeIndex === index;
                        const handleActiveItem = this.actions.handleActiveItem(index);

                        if (typeof itemRenderer === 'function') {
                            if (item) {
                                row = itemRenderer({
                                    index,
                                    isActive: isActive,
                                    item,
                                    onActive: handleActiveItem,
                                    onSelect: this.actions.handleSelectItem(item, index),
                                    onDeselect: this.actions.handleDeselectItem(item, index)
                                });
                            }
                        }

                        return (
                            <div
                                key={getItemUniqueId(item)}
                                ref={(node => {
                                    this.itemNodes[index] = node;
                                })}
                                onMouseOver={handleActiveItem}
                            >
                                {row}
                            </div>
                        );
                    })
                }
            </div>
        );
    }
}

Menu.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,

    // Specific menu opened or not
    open: PropTypes.bool,

    // Array of each item's data for build item menu
    items: PropTypes.arrayOf(PropTypes.object),

    // Array index to specific witch item (in items) is active
    activeIndex: PropTypes.number,

    // Specific to Scroll the active item into view
    // This could help for keyboard operation with scrollbar
    // keyboard will set it to true
    shouldScrollActiveItemIntoView: PropTypes.bool,

    /*
     * Callback invoked when update active index
     * updateActiveIndex(index)
     *
     * @ index
     * Type: number
     * Description: array index of active item in items
     */
    updateActiveIndex: PropTypes.func.isRequired,

    /*
     * function for get list item's unique id for render (as key)
     * getItemUniqueId(itemData)
     *
     * @ itemData
     * Type: object
     * Description: The item object in items
     */
    getItemUniqueId: PropTypes.func.isRequired,

    /*
     * A row renderer for rendering a list item
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
     * onSelectItem(itemData)
     *
     * @ itemData
     * Type: object
     * Description: The item object in items
     */
    onSelectItem: PropTypes.func,

    /*
     * Callback invoked when a item is deselected
     * onDeselectItem(itemData)
     *
     * @ itemData
     * Type: object
     * Description: The item object in items
     */
    onDeselectItem: PropTypes.func
};

Menu.defaultProps = {
    className: '',
    style: {},
    items: [],
    activeIndex: -1,
    shouldScrollActiveItemIntoView: false,
    onSelectItem: () => {}, // dummy function
    onDeselectItem: () => {} // dummy function
};

export default Menu;

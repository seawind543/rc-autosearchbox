import PropTypes from 'prop-types';
import React, { PureComponent, Fragment } from 'react';
import classNames from 'classnames';

import styles from './input.styl';

class Input extends PureComponent {
    actions = {
        handleClickClearBtn: (e) => {
            // Set focus then call clear to avoid search on incorrect value
            if (this.input) {
                this.input.focus();
            }
            this.props.onClickClearBtn(e);
        }
    };

    render() {
        const {
            className,
            style,
            value,
            onFocus,
            onInput,
            onKeyDown,
            ...props
        } = this.props;

        // remove un-render-able props
        delete props.onClickClearBtn;

        return (
            <Fragment>
                <input
                    ref={(node => {
                        this.input = node;
                    })}
                    {...props}
                    type="text"
                    style={style}
                    className={classNames(
                        className,
                        styles.input
                    )}
                    value={value}
                    onFocus={onFocus}
                    onInput={onInput}
                    onKeyDown={onKeyDown}
                />
                { value.length > 0 &&
                    <button
                        type="button"
                        className={styles.close}
                        onClick={this.actions.handleClickClearBtn}
                    >
                        &times;
                    </button>
                }
            </Fragment>
        );
    }
}

Input.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,

    // The value of input-box
    value: PropTypes.string.isRequired,

    /*
     * Callback invoked when focus on input-box
     * onFocus(event)
     *
     * @ event
     * Type: object
     * Description: onFocus event
     */
    onFocus: PropTypes.func.isRequired,

    /*
     * Callback invoked when user input
     * onInput(event)
     *
     * @ event
     * Type: object
     * Description: onInput event
     */
    onInput: PropTypes.func.isRequired,

    /*
     * Callback invoked when key down
     * onKeyDown(event)
     *
     * @ event
     * Type: object
     * Description: onKeyDown event
     */
    onKeyDown: PropTypes.func.isRequired,

    /*
     * Callback invoked when click clear button
     * onClickClearBtn(event)
     *
     * @ event
     * Type: object
     * Description: onClick event
     */
    onClickClearBtn: PropTypes.func.isRequired
};

Input.defaultProps = {
    className: '',
    style: {}
};

export default Input;

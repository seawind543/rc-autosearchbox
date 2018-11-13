import 'trendmicro-ui/dist/css/trendmicro-ui.css';
import React, { PureComponent, Fragment } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import Navbar from './Navbar';
import Section from './Section';
import AutoSearchBox from '../src';

import styles from './index.styl';

const name = 'React AutoSearchBox';

const apps = [
    { id: 0, name: 'App 0' },
    { id: 1, name: 'App 1' },
    { id: 2, name: 'App 2' },
    { id: 3, name: 'App 3' },
    { id: 4, name: 'App 4' },
    { id: 5, name: 'App 5' },
    { id: 6, name: 'App 6' },
    { id: 7, name: 'App 7' },
    { id: 8, name: 'App 8' },
    { id: 9, name: 'App 9' },
    { id: 10, name: 'Item 0' },
    { id: 11, name: 'Item 1' },
    { id: 12, name: 'Item 2' },
    { id: 13, name: 'Item 3' },
    { id: 14, name: 'Item 4' },
    { id: 15, name: 'Item 5' },
    { id: 16, name: 'Item 6' },
    { id: 17, name: 'Item 7' },
    { id: 18, name: 'Item 8' },
    { id: 19, name: 'Item 9' }
];


class App extends PureComponent {
    actions = {
        handleSearch: (keyword) => {

        },
        getItemDisplayedName: (app) => {
            return app.name;
        },
        getItemUniqueId: (app) => {
            return app.id;
        },
        handleSelectApp: (app) => (e) => {
            console.log(`Select ${app.name}`);
        },
        handleDeselectApp: (app) => (e) => {
            console.log(`Deselect ${app.name}`);
        }
    };

    render() {
        return (
            <div>
                <Navbar name={name} />
                <div className="container-fluid" style={{ padding: '20px 20px 0' }}>
                    <div className="row">
                        <div className="col-md-12">
                            <Section className="row-md-6">
                                <h2>Make input:</h2>
                                <AutoSearchBox
                                    onSearch={this.actions.handleSearch}
                                    menuItems={apps}
                                    getItemDisplayedName={this.actions.getItemDisplayedName}
                                    getItemUniqueId={this.actions.getItemUniqueId}
                                >
                                    {(props) => {
                                        const {
                                            index,
                                            isActive,
                                            item
                                        } = props;

                                        return (
                                            <Fragment>
                                                { index === 0 && <div className={styles.divider} /> }
                                                <div
                                                    className={classNames(
                                                        styles.item,
                                                        { [styles.active]: isActive }
                                                    )}
                                                    onClick={this.actions.handleSelectApp(item)}
                                                    role="presentation"
                                                >
                                                    <div className={styles.label}>
                                                        {item.name}
                                                    </div>
                                                </div>
                                                <div className={styles.divider} />
                                            </Fragment>
                                        );
                                    }}
                                </AutoSearchBox>
                            </Section>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('container')
);

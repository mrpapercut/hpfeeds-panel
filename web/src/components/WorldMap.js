import { Component, createElement as E } from 'react';
import {
    ComposableMap,
    ZoomableGroup,
    Geographies,
    Geography,
    Markers,
    Marker
} from 'react-simple-maps';

/*
import { scaleLinear } from 'd3-scale';
const cityScale = (value, max) =>
    (scaleLinear()
        .domain([0, max])
        .range([1, 25]))(value);
*/

class WorldMap extends Component {
    constructor(props) {
        super(props);

        this.state = {
            zoom: 1,
            center: [0, 20],
            tooltip: {
                show: false,
                city: null,
                coordinates: []
            }
        };
    }

    componentDidMount() {
        window.addEventListener('wheel', this.handleScroll.bind(this));
    }

    componentWillUnmount() {
        window.removeEventListener('wheel', this.handleScroll.bind(this));
    }

    handleScroll(e) {
        // Check if we're scrolling inside or outside the worldmap
        const hasWorldMapParent = e.path.filter(el =>
            el.classList && el.classList.contains('worldMapWrapper'));

        if (hasWorldMapParent.length === 0) return;

        // let worldMapParent = hasWorldMapParent.pop();

        e.preventDefault();

        let {zoom, center} = this.state;
        if (e.deltaY > 0) {
            zoom = zoom > 1 ? zoom - 1 : 1;
            if (zoom === 1) center = [0, 20];
        } else if (e.deltaY < 0) {
            zoom++;
        }

        this.setState({
            zoom,
            center
        });
    }

    handleCityMouseOver(marker, event) {
        this.setState({
            tooltip: {
                show: true,
                city: marker.city,
                coordinates: marker.coordinates,
                ids: marker._ids
            }
        });
    }

    handleCityMouseOut(marker, event) {
        this.setState({
            tooltip: {
                show: false,
                city: '',
                coordinates: [],
                ids: []
            }
        });
    }

    handleCityClick(marker, event) {
        console.log('click', marker);
    }

    groupFeeds(feeds) {
        // Filter out feeds without coordinates
        let newFeeds = feeds.filter(feed => {
            return feed._source.coordinates[0] !== null && feed._source.coordinates[1] !== null;
        }).map(feed => {
            feed._source._id = feed._id;
            feed._source._isNew = feed._isNew;
            return feed._source;
        });

        const grouped = [];

        newFeeds.forEach(feed => {
            if (grouped.filter(f => f.city === feed.city).length === 0) {
                feed._count = 1;
                feed._ids = [feed._id];
                grouped.push(feed);
            } else {
                grouped.forEach(f => {
                    if (f.city === feed.city) {
                        f._count++;
                        f._ids.push(feed._id);
                    }
                });
            }
        });

        return grouped;
    }

    render() {
        const feeds = this.groupFeeds(this.props.feeds);

        const {tooltip} = this.state;

        return E('div', {
            className: 'container worldMapWrapper'
        },
        E(ComposableMap, {
            projectionConfig: {
                scale: 205
            },
            width: 980,
            height: 551,
            style: {
                width: '100%',
                height: 'auto'
            }
        },
        E(ZoomableGroup, {
            center: this.state.center,
            zoom: this.state.zoom
        },
        E(Geographies, {
            geography: 'world-50m.json'
        },
        (geographies, projection) => {
            return geographies.map((geography, i) => {
                return geography.id !== 'ATA' && (
                    E(Geography, {
                        key: i,
                        geography: geography,
                        projection: projection,
                        style: {
                            default: {
                                fill: 'rgba(16, 16, 16, 0.8)', // "#ECEFF1",
                                stroke: 'rgba(0, 255, 255, 1)', // 'rgba(0, 78, 255, 1)', // "#607D8B",
                                strokeWidth: 0.75,
                                outline: 'none'
                            },
                            hover: {
                                fill: '#111',
                                stroke: '#fff',
                                strokeWidth: 0.75,
                                outline: 'none'
                            },
                            pressed: {
                                fill: '#111',
                                stroke: '#fff',
                                strokeWidth: 0.75,
                                outline: 'none'
                            }
                        }
                    })
                );
            });
        }
        ),
        E(Markers, {},
            feeds.map((feed, i) => {
                return E(Marker, {
                    key: i,
                    marker: {
                        _ids: feed._ids,
                        _count: feed._count,
                        city: feed.city,
                        coordinates: [feed.longitude, feed.latitude]
                    },
                    onMouseEnter: this.handleCityMouseOver.bind(this),
                    onMouseLeave: this.handleCityMouseOut.bind(this),
                    onClick: this.handleCityClick.bind(this)
                },
                feed._isNew ? E('circle', {
                    cx: 0,
                    cy: 0,
                    r: 10 * this.state.zoom,
                    fill: 'rgba(0, 255, 78, .5)',
                    stroke: 'rgba(0, 255, 78, 1)',
                    strokeWidth: '2'
                }) : E('circle', {
                    cx: 0,
                    cy: 0,
                    r: 2 * this.state.zoom,
                    fill: 'rgba(255, 78, 0, 0.8)',
                    stroke: 'rgba(255, 78, 0, 1)',
                    strokeWidth: '2'
                })
                );
            })
        ),
        tooltip.show ? E(Markers, {},
            E(Marker, {
                key: 'tooltip',
                marker: {
                    city: tooltip.city,
                    coordinates: tooltip.coordinates
                }
            },
            E('rect', {
                x: 0,
                y: 0,
                width: 200,
                height: 60, // 45 + (tooltip.ids.length * 14),
                fill: '#111',
                stroke: 'rgba(0, 255, 255, 1)',
                strokeWidth: 1
            }),
            E('text', {
                x: 0,
                y: '.5em',
                width: 190,
                height: 90,
                fontFamily: 'Inconsolata',
                fontSize: '.8em',
                fill: '#fff'
            },
            [tooltip.city, ' ', `${tooltip.ids.length} hit(s)`].map((text, i) => E('tspan', {
                key: i,
                x: '1em',
                dy: '1em'
            }, text))
            )
            )
        ) : null
        )
        )
        );
    }
}

export default WorldMap;

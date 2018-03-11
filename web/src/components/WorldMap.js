import React, { Component, createElement as E } from 'react'
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography,
  Markers,
  Marker,
} from 'react-simple-maps'
import { scaleLinear } from 'd3-scale';

const cityScale = (value, max) => (scaleLinear()
  .domain([0, max])
  .range([1, 25]))(value);

class WorldMap extends Component {
    constructor(props) {
        super(props);
    }

    handleCityHover(marker, event) {
        console.log('hover', marker);
    }

    handleCityClick(marker, event) {
        console.log('click', marker);
    }

    groupFeeds(feeds) {
        const groupedFeeds = [];
        return feeds;
        return feeds.map(feed => {

        });
    }

    render() {
        const feeds = this.groupFeeds(this.props.feeds);

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
                    center: [0, 20]
                },
                    E(Geographies, {
                        geography: "world-50m.json"
                    },
                        (geographies, projection) => {
                            return geographies.map((geography, i) => {
                                return geography.id !== "ATA" && (
                                    E(Geography, {
                                        key: i,
                                        geography: geography,
                                        projection: projection,
                                        style: {
                                            default: {
                                                fill: '#000', // "#ECEFF1",
                                                stroke: 'rgba(0, 255, 255, 1)', // 'rgba(0, 78, 255, 1)', // "#607D8B",
                                                strokeWidth: 0.75,
                                                outline: "none",
                                            },
                                            hover: {
                                                fill: "#111",
                                                stroke: "#fff",
                                                strokeWidth: 0.75,
                                                outline: "none",
                                            },
                                            pressed: {
                                                fill: "#111",
                                                stroke: "#fff",
                                                strokeWidth: 0.75,
                                                outline: "none",
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
                                    _id: feed._id,
                                    city: feed._source.city,
                                    coordinates: [feed._source.longitude, feed._source.latitude]
                                },
                                onMouseMove: this.handleCityHover,
                                onClick: this.handleCityClick
                            },
                                feed._isNew ? E('circle', {
                                    cx: 0,
                                    cy: 0,
                                    r: 15,
                                    fill: 'rgba(0, 255, 78, .5)',
                                    stroke: 'rgba(0, 255, 78, 1)',
                                    strokeWidth: '2'
                                }) : E('circle', {
                                    cx: 0,
                                    cy: 0,
                                    r: 10, // cityScale(feed._source.local_port, 11965),
                                    fill: 'rgba(255, 78, 0, 0.1)',
                                    stroke: 'rgba(255, 78, 0, 1)',
                                    strokeWidth: '2'
                                })
                            )
                        })
                    )
                )
            )
        );
    }
}

export default WorldMap;

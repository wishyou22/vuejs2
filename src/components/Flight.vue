<script>
// import { getFlightsData } from '../api/data';
import axios from "axios";

export default {
    data() {
        return {
            flights: [],
            source: '',
            destination: '',
            sortBy: 'duration',
            errorMessage: '',
            hasSearched: false,
            url: "https://gbi-team-filesystem.s3.us-east-1.amazonaws.com/flights.json"
        };

    },
    computed: {
        allCities() {
            const citySet = new Set();
            this.flights.forEach((flight) => {
                if (!flight.segment) return;
                flight.segment.forEach((seg) => {
                    citySet.add(seg.origin);
                    citySet.add(seg.destination);
                });
            });
            return Array.from(citySet).sort();
        },
        availableSources() {
            return this.allCities;
        },
        availableDestinations() {
            if (!this.source) return this.allCities;

            const destinationSet = new Set();

            this.flights.forEach((flight) => {
                if (!flight.segment || flight.segment.length === 0) return;

                const firstSegment = flight.segment[0];
                const lastSegment = flight.segment[flight.segment.length - 1];

                if (firstSegment.origin === this.source) {
                    destinationSet.add(lastSegment.destination);
                }
            });

            return Array.from(destinationSet);
        },
        filteredFlights() {

            if (!this.source || !this.destination || this.source === this.destination) {
                return [];
            }

            const results = this.flights.filter((flight) => {
                if (!flight.segment || flight.segment.length === 0) return false;

                const firstSegment = flight.segment[0];
                const lastSegment = flight.segment[flight.segment.length - 1];

                return (
                    firstSegment.origin === this.source &&
                    lastSegment.destination === this.destination
                );
            });

            const mappedResults = results.map((flight) => {
                const firstSegment = flight.segment[0];
                const lastSegment = flight.segment[flight.segment.length - 1];

                return {
                    id: flight.id,
                    company: flight.company,
                    duration: flight.duration,
                    departureTime: firstSegment.departureTime,
                    arrivalTime: lastSegment.arrivalTime,
                    origin: firstSegment.origin,
                    destination: lastSegment.destination,
                    stops: flight.segment.length - 1,
                };
            });


            if (this.sortBy === 'duration') {
                mappedResults.sort((a, b) => a.duration - b.duration);
            }

            return mappedResults;
        }
    },

    mounted() {
        this.getFlightsData()
    },
    watch: {
        source() {
            this.destination = '';
            this.validateSelection();
        },
        destination() {
            this.validateSelection();
        }
    },
    methods: {
        validateSelection() {
            this.errorMessage = '';

            if (!this.source || !this.destination) {
                this.hasSearched = false;
                return;
            }

            if (this.source === this.destination) {
                this.errorMessage = "Source and Destination cannot be the same";
                this.destination = '';
                this.hasSearched = false;
                return;
            }


            //  console.log(this.destination)

            if (!this.availableDestinations.includes(this.destination)) {
                this.errorMessage = "Destination is invalid for selected source";
                this.destination = '';
                this.hasSearched = false;
                return;
            }

            this.hasSearched = true;
        },
        swapLocations() {
            if (!this.source && !this.destination) return;

            [this.source, this.destination] = [this.destination, this.source];
            this.validateSelection();
        },
        formatDuration(minutes) {
            const h = Math.floor(minutes / 60);
            const m = minutes % 60;
            return `${h}h ${m}m`;
        },
        formatTime(dateString) {
            const date = new Date(dateString);
            return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        },
        formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        },

        async getFlightsData() {
            console.log("data")
            try {
                const response = await axios.get(this.url)
                console.log(response.data)
                const arr = response?.data
                this.flights = arr


            } catch (error) {
                console.error("API Error:", error);
                throw error;
            }

        }

    },


};
</script>
<template>

    <div id="app" v-cloak>
        <div class="background-effect"></div>
        <div class="container">
            <!-- Header Section -->
            <header class="header">
                <div class="logo">
                    <i class="fa-solid fa-plane-departure"></i>
                    <h1>Flight services</h1>
                </div>
                <p class="subtitle">Find the best routes at the lowest duration.</p>
            </header>

            <!-- Search Card -->
            <div class="search-card glassy">
                <div class="search-form">
                    <div class="input-group">
                        <label for="source"><i class="fa-solid fa-location-dot"></i> Source</label>
                        <select id="source" v-model="source" @change="validateSelection">
                            <option value="">Select origin city</option>
                            <option v-for="city in availableSources" :key="city" :value="city">
                                {{ city }}
                            </option>
                        </select>
                    </div>

                    <div class="swap-icon" @click="swapLocations" :class="{ 'clickable': source || destination }">
                        <i class="fa-solid fa-arrow-right-arrow-left"></i>
                    </div>

                    <div class="input-group">
                        <label for="destination"><i class="fa-solid fa-location-crosshairs"></i> Destination</label>
                        <select id="destination" v-model="destination" @change="validateSelection">
                            <option value="">Select destination city</option>
                            <option v-for="city in availableDestinations" :key="city" :value="city">
                                {{ city }}
                            </option>
                        </select>
                    </div>

                    <!-- Sort Selection -->
                    <div class="input-group sort-group">
                        <label for="sort"><i class="fa-solid fa-filter"></i> Sort By</label>
                        <select id="sort" v-model="sortBy">
                            <option value="duration">Lowest Duration First</option>
                        </select>
                    </div>
                </div>

                <!-- Error Message -->
                <transition name="fade">
                    <div class="error-message" v-if="errorMessage">
                        <i class="fa-solid fa-circle-exclamation"></i> {{ errorMessage }}
                    </div>
                </transition>
            </div>

            <!-- Results Section -->
            <div class="results-section">
                <!-- Empty State -->
                <div v-if="!hasSearched" class="empty-state">
                    <div class="empty-icon"><i class="fa-solid fa-magnifying-glass-location"></i></div>
                    <h3>Ready to explore?</h3>
                    <p>Select a source and destination to view available flights.</p>
                </div>

                <!-- No Results State -->
                <div v-else-if="filteredFlights.length === 0" class="empty-state">
                    <div class="empty-icon"><i class="fa-solid fa-plane-slash"></i></div>
                    <h3>No flights found</h3>
                    <p>We couldn't find any flights from {{ source }} to {{ destination }}.</p>
                </div>

                <!-- Flight List -->
                <transition-group name="list" tag="div" class="flight-list" v-else>
                    <div class="flight-card glassy" v-for="flight in filteredFlights" :key="flight.id">
                        <div class="flight-header">
                            <div class="airline-info">
                                <div class="airline-logo">
                                    <i class="fa-solid fa-plane"></i>
                                </div>
                                <span class="company-name">{{ flight.company }}</span>
                            </div>
                            <div class="duration-badge">
                                <i class="fa-regular fa-clock"></i> {{ formatDuration(flight.duration) }}
                            </div>
                        </div>

                        <div class="flight-body">
                            <!-- Departure -->
                            <div class="time-location">
                                <div class="time">{{ formatTime(flight.departureTime) }}</div>
                                <div class="date">{{ formatDate(flight.departureTime) }}</div>
                                <div class="city">{{ flight.origin }}</div>
                            </div>

                            <!-- Flight Path visualization -->
                            <div class="flight-path">
                                <div class="path-line"></div>
                                <div class="stops">
                                    <span class="stop-dot"></span>
                                    <div class="stop-info" v-if="flight.stops > 0">
                                        {{ flight.stops }} {{ flight.stops === 1 ? 'stop' : 'stops' }}
                                    </div>
                                    <div class="stop-info direct" v-else>Direct</div>
                                    <span class="stop-dot"></span>
                                </div>
                            </div>

                            <!-- Arrival -->
                            <div class="time-location text-right">
                                <div class="time">{{ formatTime(flight.arrivalTime) }}</div>
                                <div class="date">{{ formatDate(flight.arrivalTime) }}</div>
                                <div class="city">{{ flight.destination }}</div>
                            </div>
                        </div>
                    </div>
                </transition-group>
            </div>
        </div>
    </div>
</template>
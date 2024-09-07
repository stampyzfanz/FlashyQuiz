<!-- Adapted from vanilla HTML, CSS and JS at https://codepen.io/alvarotrigo/pen/dyVYJmJ -->
<template>
    <div class="progress-bar-container">
        <div class="progress-bar full" style="width: 100%"></div>
        <div class="progress-bar active" :class="this.progress !== undefined ? 'manual-control' : ''"></div>
    </div>
</template>

<script>
import gsap from 'gsap'

export default {
    name: 'ProgressBar',
    /*
        Either the current progress (a float between 0 and 1) is required or 
        the duration in milliseconds if its meant to evenly increase
    */
    props: {
        progress: {
            type: Number,
            validator: (number) => 0 <= number <= 1
        },
        duration: {
            type: Number
        }
    },
    data() {
        return {
            percentage: 0.04
        }
    },
    watch: {
        progress() {
            this.percentage = 4 + this.progress * 96;
        }
    },
    mounted() {
        if (this.duration !== undefined) {
            // Animate the progress bar using the GreenSock Animation Platform
            gsap.to(this, {
                duration: this.duration / 1000,
                percentage: 100,
                ease: "none"
            });
        } else {
            this.percentage = 4 + this.progress * 96;
        }
    }
};
</script>

<style scoped>
.progress-bar-container {
    position: relative;
}

.progress-bar {
    height: 20px;
    border-radius: 50px;

    position: absolute;
}

.progress-bar.manual-control {
    transition: all 0.5s;
}

.progress-bar.active {
    background: #1da1f2;
    box-shadow: 2px 14px 15px -7px rgba(30, 166, 250, 0.36);

    width: v-bind('percentage + "%"');
}

.progress-bar.full {
    background: grey;
    box-shadow: 2px 14px 15px -7px rgba(90, 90, 90, 0.36);
}
</style>
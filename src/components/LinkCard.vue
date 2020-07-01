<template>
    <div class="card-link" @click="handleClick">
        <div class="card-link-icon">
            <slot name="icon"></slot>
        </div>
        <div class="card-link-text">
            <span>{{text}}</span>
        </div>
        <div class="card-link-go">
            <i class="el-icon-arrow-right"></i>
        </div>
    </div>
</template>

<script>
export default {
    name: 'component.linkCard',
    props: ['text', 'link'],
    methods: {
        handleClick() {
            window.open(this.link);
        }
    }
}
</script>
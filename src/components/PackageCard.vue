<template>
    <div class="card-package">
        <div class="card-package-name" @click="handleClick">
            <span>{{pack.name}}</span>
            <i class="el-icon-arrow-right"></i>
        </div>
    </div>
</template>

<script>
export default {
    name: 'component.packageCard',
    props: ['pack'],
    methods: {
        handleClick() {
            this.$router.push(`/${this.pack.name}`);
        }
    }
}
</script>
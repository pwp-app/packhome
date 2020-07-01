<template>
    <div class="card-package" @click="handleClick">
        <div class="card-package-name">
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
            if (this.pack && this.pack.name) {
                this.$router.push(`/${this.pack.name}`);
            }
        }
    }
}
</script>
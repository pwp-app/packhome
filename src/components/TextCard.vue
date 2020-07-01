<template>
    <div class="card-text">
        <div class="card-text-content">
            <span>{{text}}</span>
            <span v-if="secondaryText">{{secondaryText}}</span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'component.textCard',
    props: ['text', 'secondaryText']
}
</script>
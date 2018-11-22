<template>
    <div class="util_prompt" @click="hide()">
        <div class="prompt_content" @click.stop="">
            <slot></slot>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    export default{
        data() {
            return {
            
            }
        },
        methods:{
            hide() {
              //this.$store.commit('setDownloadPrompt', false)
            }
        }
    }
</script>

<style lang="less" scoped >
    .util_prompt{
        position:fixed;
        display:flex;
        z-index:9999;
        left: 0;
        top: 0;
        bottom: 0;
        right:0;
        align-items:center;
        background: rgba(55,55,55,.6);
        .prompt_content{
            position:relative;
            display:inline-block;
            margin: 0 auto;
        }
    }
</style>

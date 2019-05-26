<template>
    <div :class="$style.HomePage">
        <div :class="$style.wrap">
            <h1 :class="$style.title">
                Table UI
            </h1>
            <ui-table-app :items="items" 
                          :error="isError">
            </ui-table-app>
        </div>
    </div>
</template>

<script>
    import { emulateGetRequest } from '~/api/request.js';
    import UiTableApp from '~/components/UiTableApp';

    export default {
        name: 'HomePage',

        components: {
            UiTableApp
        },

        data() {
            return {
                items: [],
                isError: false,
            };
        },

        async asyncData() {
            try {
                let data = await emulateGetRequest();
                return {
                    items: data
                };
            } catch (e) {
                return {
                    isError: true
                };
            }
        }
    };
</script>

<style lang="scss" module>
    .HomePage {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
    }

    .title {
        font-size: 32px;
        font-weight: 600;
    }
</style>

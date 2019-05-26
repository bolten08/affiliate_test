<template>
    <div :class="$style.DeleteDialog">
        <h5 :class="$style.title">
            Are you sure you want to <span class="fw-600">delete item</span>?
        </h5>

        <div :class="$style.actions">
            <b-button :class="$style.button"
                      size="is-large" 
                      @click.stop="$emit('cancel')">
                Cancel
            </b-button>

            <b-button :class="$style.button"
                      size="is-large"
                      type="is-info"
                      @click.stop="$emit('confirm', id)">
                Confirm
            </b-button>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            id: {
                type: Number,
                required: true
            }
        }
    };
</script>


<style lang="scss" module>
    .DeleteDialog {
        background-color: #fff;
        box-shadow: 0 2px 8px rgba(0, 0, 0, .16);
        border-radius: 4px;
        padding: 16px;
    }

    .title {
        margin-bottom: 8px;
        white-space: nowrap;
        color: $black_text;
    }

    .actions {
        display: flex;
        justify-content: flex-end;
    }

    .button {
        margin-right: 8px;

        &:last-child {
            margin-right: 0;
        }
    }
</style>

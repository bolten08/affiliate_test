<template>
    <div :class="$style.UiTable">
        <div :class="$style.actions">
            <div :class="$style.group">
                <h6 :class="$style.groupTitle">
                    Group By:
                </h6>

                <b-button type="is-text"
                          :class="{_active: group === 'product'}"
                          :disabled="error || items.length === 0"
                          @click="group = 'product'">
                    Dessert (100g serving)
                </b-button>
                <b-button type="is-text"
                          :class="{_active: group === 'calories'}"
                          :disabled="error || items.length === 0"
                          @click="group = 'calories'">
                    Calories
                </b-button>
                <b-button type="is-text"
                          :class="{_active: group === 'fat'}"
                          :disabled="error || items.length === 0"
                          @click="group = 'fat'">
                    Fat (g)
                </b-button>
                <b-button type="is-text"
                          :class="{_active: group === 'carbs'}"
                          :disabled="error || items.length === 0"
                          @click="group = 'carbs'">
                    Carbs (g)
                </b-button>
                <b-button type="is-text"
                          :class="{_active: group === 'protein'}"
                          :disabled="error || items.length === 0"
                          @click="group = 'protein'">
                    Protein (g)
                </b-button>
                <b-button type="is-text"
                          :class="{_active: group === 'iron'}"
                          :disabled="error || items.length === 0"
                          @click="group = 'iron'">
                    Iron (%)
                </b-button>
            </div>

            <div :class="$style.options">
                <b-button :type="checked.length ? 'is-info' :''"
                          size="is-large"
                          :disabled="!checked.length || isDeleteRequestSend"
                          :outlined="!checked.length" 
                          @click="deleteSelectedItems">
                    Delete <template v-if="checked.length">({{ checked.length }})</template>
                </b-button>

                <b-dropdown v-model="perpage"
                            :disabled="error || items.length === 0"
                            :class="[$style.select, $style.perpage]">
                    <template #trigger>
                        <b-button size="is-large"
                                  outlined>
                            {{ perpage }} Per Page
                        </b-button>
                    </template>

                    <b-dropdown-item :value="5">
                        5 Per Page
                    </b-dropdown-item>

                    <b-dropdown-item :value="10">
                        10 Per Page
                    </b-dropdown-item>

                    <b-dropdown-item :value="15">
                        15 Per Page
                    </b-dropdown-item>

                    <b-dropdown-item :value="20">
                        20 Per Page
                    </b-dropdown-item>
                </b-dropdown>

                <div :class="$style.pagination"
                     class="pagination">
                    <b-button class="pagination-previous"
                              :disabled="page === 1 || error || items.length === 0"
                              @click="page -= 1">
                        <i class="mdi mdi-chevron-left mdi-24px"></i>
                    </b-button>

                    <div :class="$style.paginationCount">
                        <span class="fw-600">{{ currentCount }}</span> of <span class="fw-600">{{ itemsCopy.length }}</span>
                    </div>

                    <b-button class="pagination-next"
                              :disabled="page * perpage >= items.length || error || items.length === 0"
                              @click="page += 1">
                        <i class="mdi mdi-chevron-right mdi-24px"></i>
                    </b-button>
                </div>

                <b-dropdown :class="$style.select"
                            :disabled="error || items.length === 0"
                            multiple>
                    <template #trigger>
                        <b-button size="is-large"
                                  outlined>
                            {{ activeColumns.length }} Columns Selected
                        </b-button>
                    </template>

                    <b-dropdown-item custom>
                        <b-checkbox :value="activeColumns.length === columns.length"
                                    :native-value="true"
                                    :disabled="activeColumns.length === columns.length"
                                    @change.native="selectAllCols">
                            <span class="fw-600">Select all</span>
                        </b-checkbox>
                    </b-dropdown-item>

                    <b-dropdown-item v-for="col in columns"
                                     :key="col.field"
                                     custom>
                        <b-checkbox v-model="activeColumns"
                                    :native-value="col.field">
                            {{ col.label }}
                        </b-checkbox>
                    </b-dropdown-item>
                </b-dropdown>
            </div>
        </div>

        <b-table ref="table"
                 :class="$style.table"
                 :data="itemsCopy"
                 :per-page="perpage"
                 :current-page.sync="page"
                 :selected.sync="selected"
                 :checked-rows.sync="checked"
                 default-sort-direction="asc"
                 :default-sort="orderedColumns[0].field"
                 paginated
                 pagination-simple
                 striped
                 hoverable
                 checkable>
            <template slot="empty">
                <section class="section">
                    <div class="content has-text-grey has-text-centered">
                        <p>
                            <b-icon icon="emoticon-sad"
                                    size="is-large">
                            </b-icon>
                        </p>
                        <p v-if="!error">Данных пока нет</p>
                        <p v-else>
                            При загрузке данных произошла ошибка. Попробуйте обновить страницу.
                        </p>
                    </div>
                </section>
            </template>

            <template slot-scope="props">
                <b-table-column v-for="(col, index) in orderedColumns"
                                :key="index"
                                :field="col.field"
                                :label="col.label"
                                :width="col.width"
                                :sortable="index === 0">
                    {{ props.row[col.field] }}
                </b-table-column>

                <b-table-column :class="$style.deleteCol"
                                field=""
                                label=""
                                :width="90">
                    <transition name="fade">
                        <delete-dialog v-if="isDeleteMessageVisible === props.row.id"
                                       :id="props.row.id"
                                       :class="$style.dialog"
                                       @cancel="cancelDeleteDialog"
                                       @confirm="deleteSelectedItem">
                        </delete-dialog>
                    </transition>

                    <span :class="$style.deleteBtn"
                          @click="isDeleteMessageVisible = props.row.id">
                        <i class="mdi mdi-delete mdi-16px"></i> Delete
                    </span>
                </b-table-column>
            </template>
        </b-table>
    </div>
</template>

<script>
    import { emulateDeleteRequest } from '~/api/request.js';
    import DeleteDialog from '~/components/DeleteDialog';

    export default {
        components: {
            DeleteDialog
        },

        props: {
            items: {
                type: Array,
                default: () => []
            },
            error: Boolean
        },

        data() {
            return {
                itemsCopy: this.items,
                columns: [
                    {
                        field: 'product',
                        label: 'Dessert (100g serving)',
                        width: '240',
                        sortable: false
                    },
                    {
                        field: 'calories',
                        label: 'Calories',
                        width: '130',
                        sortable: false
                    },
                    {
                        field: 'carbs',
                        label: 'Carbs',
                        width: '130',
                        sortable: false
                    },
                    {
                        field: 'fat',
                        label: 'Fat (g)',
                        width: '130',
                        sortable: false
                    },
                    {
                        field: 'protein',
                        label: 'Protein (g)',
                        width: '130',
                        sortable: false
                    },
                    {
                        field: 'iron',
                        label: 'Iron (%)',
                        width: '80',
                        sortable: false
                    }
                ],
                group: 'product',
                perpage: '10',
                page: 1,
                activeColumns: [],
                selected: null,
                checked: [],
                isDeleteMessageVisible: false,
                isDeleteRequestSend: false,
            };
        },

        computed: {
            orderedColumns() {
                let cols = this.columns.slice().sort((a, b) => {
                    if (a.field === this.group) {
                        a.sortable = true;
                        return -1;
                    }
                    if (b.field === this.group) {
                        b.sortable = true;
                        return 1;
                    }
                    return 0;
                });

                return cols.filter(col => this.activeColumns.includes(col.field));
            },

            currentCount() {
                let min = (this.page - 1) * this.perpage + 1;
                let max =
                    this.page * this.perpage >= this.itemsCopy.length
                        ? this.items.length
                        : this.page * this.perpage;
                return `${min}-${max}`;
            },
        },

        watch: {
            orderedColumns() {
                this.$nextTick(() => {
                    this.$refs.table.initSort();
                });
            },

            activeColumns() {
                this.$nextTick(() => {
                    this.$refs.table.initSort();
                });
            }
        },

        created() {
            this.activeColumns = this.columns.map(col => col.field);
        },

        methods: {
            selectAllCols(e) {
                this.activeColumns = this.columns.map(col => col.field);
            },

            cancelDeleteDialog() {
                this.isDeleteMessageVisible = false;
                this.selected = null;
            },

            deleteSelectedItems() {
                this.isDeleteRequestSend = true;

                emulateDeleteRequest()
                    .then(e => {
                        this.$toast.open({
                            message: 'Something happened correctly!',
                            type: 'is-success'
                        });
                        this.itemsCopy = this.itemsCopy.filter(item => !this.checked.includes(item));
                        this.checked = [];
                        this.isDeleteRequestSend = false;
                    })
                    .catch(e => {
                        this.$toast.open({
                            message: 'Something goes wrong :(',
                            type: 'is-danger'
                        });
                        this.isDeleteRequestSend = false;
                    });
            },

            deleteSelectedItem() {
                this.isDeleteMessageVisible = false;
                this.isDeleteRequestSend = true;

                emulateDeleteRequest()
                    .then(e => {
                        this.$toast.open({
                            message: 'Something happened correctly!',
                            type: 'is-success'
                        });
                        this.itemsCopy = this.itemsCopy.filter(item => item.id !== this.selected.id);
                        this.selected = null;
                    })
                    .catch(e => {
                        this.$toast.open({
                            message: 'Something goes wrong :(',
                            type: 'is-danger'
                        });
                        this.isDeleteRequestSend = false;
                    });
            }
        }
    };
</script>

<style lang="scss" module>
    .UiTable {
        width: $container-w;
    }

    .actions {
        display: flex;
        justify-content: space-between;
        padding: 16px 0;
        border-top: 1px solid $grey;
    }

    .group {
        display: flex;
        align-items: center;
    }

    .groupTitle {
        display: inline-block;
        margin-right: 8px;
        font-weight: 700;
    }

    .options {
        display: flex;
        align-items: center;
    }

    .perpage {
        margin-left: 8px;
    }

    .pagination {
        margin: 0 16px;
    }

    .paginationCount {
        order: 2;
    }

    .table {
        font-size: 14px;

        :global(.level) {
            display: none;
        }
    }

    .deleteCol {
        position: relative;
    }

    .deleteBtn {
        color: $red;
        opacity: 0;
        transition: opacity .2s ease;
        pointer-events: none;
        cursor: pointer;

        :global(.mdi-delete) {
            color: $black_text;
        }

        :global(.is-selected) & {
            opacity: 1;
            pointer-events: all;
        }

        &:hover {

            :global(.mdi-delete) {
                color: $red;
            }
        }
    }

    .dialog {
        position: absolute;
        top: 90%;
        left: 50%;
        transform: translateX(-50%);
        z-index: 2;
    }

    .select {

        :global(.button) {
            padding-right: 32px;

            &:after {
                content: '';
                position: absolute;
                top: 50%;
                right: 12px;
                z-index: 4;
                display: block;
                width: 8px;
                height: 8px;
                margin-top: -5px;
                border: 2px solid currentColor;
                border-right: 0;
                border-top: 0;
                pointer-events: none;
                transform: rotate(-45deg);
                transition: transform .2s ease;
            }
        }

        &:global(.is-active) {

            :global(.button) {
                border-color: $blue;
                color: $blue;

                &:after {
                    margin-top: -2px;
                    transform: rotate(135deg);
                }
            }
        }
    }
</style>

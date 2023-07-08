<template>
  <div>
    <h2>Message Playing View</h2>

    <div class="my solo-card holder" style="max-width: 50rem;">
      <a-collapse class="my solo-card" v-model:activeKey="draftPanelActiveKey">
        <a-collapse-panel key="p1" header="Draft">
        <a-form @submit.prevent="add"
          layout="horizontal"
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 20 }"
        >
          <a-form-item label="Draft">
            <a-textarea v-model:value="draftMessage" 
              allow-clear
              :auto-size="{minRows: 4, maxRows: 8}"
              :maxlength="120"
            ></a-textarea>
          </a-form-item>
          <a-form-item class="button-bar" 
            :wrapper-col="{ offset: 4, span: 20 }"
          >
            <a-button @click="add()"
            type="primary">
              add
            </a-button>
            <a-button @click="addJunk(10)">
              <template #icon></template>
              add junk
            </a-button>
            <a-button @click="fetchNews(50)"
            danger>
              <template #icon><AlertFilled /></template>
              add news(CORS)
            </a-button>
            <a-button @click="clear"
            danger>
              <template #icon><DeleteFilled /></template>
              clear
            </a-button>
          </a-form-item>
        </a-form>
      </a-collapse-panel>
      </a-collapse>
    </div>
    
    <a-table :columns="tableColumns" :dataSource="tableData"
      rowKey="id"
      :pagination="pagination"
      size="default" :stick="false"
    >
      <template #bodyCell="{ text, column, record }">
        <template v-if="column.dataIndex == 'realpos'">
          <div style="min-width: 2.4rem; display: inline-block;">
            <a-tag v-if="record.icon_desc"
            :color="record.icon_desc_color">
              {{ record.icon_desc }}
            </a-tag>
          </div>
          {{ text }}
        </template>

        <template v-if="column.dataIndex == 'fake_for_actions'">
          <a-button @click="deleteItem(record.realpos)"
          class="crossing-item" shape="circle">
            <template #icon><DeleteFilled /></template>
          </a-button>
        </template>
      </template>

      <template #emptyText>
        No Records.
      </template>
    </a-table>
    
  </div>
</template>

<script lang="ts">
import { ref } from 'vue';
import { 
    DeleteFilled,
    AlertFilled,
  } from '@ant-design/icons-vue';
import type { TablePaginationConfig } from 'ant-design-vue';

// based on JSON data structure of weibo
interface NewsStructure {
  ok: number;
  data: {
    realtime: NewsItem[];
    hotgovs: NewsItem[];
    hotgov: NewsItem;
  };
}

interface NewsItem {
  realpos: number; // id
  ad_channel?: number; // exists if it is an Ad
  onboard_time: number;
  category: string;
  note: string;
  icon_desc?: string;
  icon_desc_color?: string;
}

interface MessageItem {
  text: string;
}

export default {
  components: { 
    DeleteFilled,
    AlertFilled,
  },
  data() {
    return {
      manualNewsCounter: ref(1000),
      draftPanelActiveKey: ref('p1'),
      draftMessage: ref(''),
      tableColumns: [
        {
          dataIndex: 'realpos',
          title: 'Seq',
        },
        {
          dataIndex: 'onboard_time',
          title: 'Time',
        },
        {
          dataIndex: 'category',
          title: 'Category',
        },
        {
          dataIndex: 'note',
          title: 'Headline',
        },
        {
          dataIndex: 'fake_for_actions', // not used
          title: 'actions',
        },
      ],
      tableData: <NewsItem[]>[],
      pagination: <TablePaginationConfig>{
        defaultPageSize: 6,
        showSizeChanger: false,
        onChange(page, pageSize) {
          console.log(`table: page changing ${page} size=${pageSize}`);
        },
      },
    };
  },
  computed: {
    isEmptyList() {
      return this.newsCount == 0;
    },
    newsCount() {
      return this.tableData.length;
    },
  },
  methods: {
    getItem(index: number): NewsItem {
      return this.tableData[index];
    },
    addManualNews(content: string){
      this.tableData.push({
        realpos: this.manualNewsCounter++,
        category: '奇闻',
        onboard_time: 1682570020,
        icon_desc: '牛',
        icon_desc_color: 'darkcyan',
        note: content,
      });
    },
    add() {
      if (this.draftMessage.length > 0) {
        this.addManualNews(this.draftMessage);
        this.draftMessage = '';
      }
    },
    addJunk(count: number){
      for (let i=0;i<count;i++) {
        this.addManualNews(`junkie message ${Math.random()}.`);
      }
    },
    async fetchNews(count: number){
      try {
        let res = await fetch('https://weibo.com/ajax/side/hotSearch');
        let parsed = <NewsStructure> await res.json();
        console.log('parsed =', parsed);
        let itemList = parsed.data.realtime.filter(it=>!it.ad_channel);
        if (itemList.length < count) {
          count = itemList.length;
        }
        for (let i=0;i<count;i++) {
          this.tableData.push(itemList[i]);
        }
      } catch (err) {
        console.error('if it is a CORS error, please try again with browser CORS disabled.');
        console.error(err);
      }
    },
    deleteItem(realpos: number) {
      let found = this.tableData.findIndex(it=>it.realpos==realpos);
      if (found >= 0) {
        this.tableData.splice(found, 1);
      }
    },
    clear(){
      this.tableData.splice(0);
    },
  },
};
</script>

<style scoped>
h2 { color: white; }

.messageList {
  border: 4px solid snow;
  border-radius: 12px;
  margin: 0.4rem;
  padding: 0.4rem;
  background-color: snow;
}

.button-bar .ant-btn {
  margin-right: 1rem;
}
</style>

<template>
  <div>
    <div style="margin: 0.4rem 0;">
      <a-button ghost @click="loadData()">
        Reload
      </a-button>
    </div>
    <a-table :columns="tableColumns"
      :dataSource="tableData"
      :loading="isFetching" :pagination="pagination"
    >
      <template #emptyText>
        No Records.
      </template>
    </a-table>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue';
import { type TablePaginationConfig } from 'ant-design-vue';
import { fetchPersonList, type Person } from '@/model/PersonData';
import { MessageService } from '@/service/MessageService';

const COLUMNS = [
  {
    dataIndex: 'id',
    title: 'ID',
  },
  {
    dataIndex: 'firstName',
    title: 'First Name',
  },
  {
    dataIndex: 'lastName',
    title: 'Last Name',
  },
  {
    dataIndex: 'dateOfBirth',
    title: 'DOB',
  },
  {
    dataIndex: 'age',
    title: 'Age',
  },
  {
    dataIndex: 'gender',
    title: 'Gender',
  },
  {
    dataIndex: 'heightInCm',
    title: 'Height(cm)',
  },
  {
    dataIndex: 'weightInKg',
    title: 'Weight(kg)',
  },
];

export default {
  computed: {
    iMessageService: ()=>MessageService(),
    tableColumns: ()=>COLUMNS,
    pageSize: ()=>8,
  },
  data() {
    return {
      tableData: <Person[]>[],
      isFetching: ref(false),
      pagination: <TablePaginationConfig>{},
      currentPageIndex: ref(0),
    };
  },
  methods: {
    async loadData(targetPage?: number): Promise<number>{
      // console.log('reloadData targetPage=', targetPage);
      this.isFetching = true;
      let isReloading: boolean = (targetPage === undefined);
      if (targetPage === undefined) {
        targetPage = this.currentPageIndex;
      }
      let offset = targetPage * this.pageSize;
      let targetPageSize = this.pageSize;
      let list = await fetchPersonList({
        offset: offset,
        limit: targetPageSize,
      });
      // console.log('tableData=', JSON.stringify(this.tableData.map(it=>it.id),null,2));

      let switchPage = this.switchPage;
      let fakeTotal: number;
      if (list.length == 0) {
        // next page is empty means last page reached,
        // update pagination to reflect this.
        this.pagination = <TablePaginationConfig>{
          total: (this.currentPageIndex+1) * targetPageSize,
          current: this.currentPageIndex+1,
          pageSize: targetPageSize,
          showSizeChanger: false,
          onChange(page, pageSize) {
            switchPage(page);
          },
        };
        this.isFetching = false;
        // console.log('pagination =', this.pagination);
        // console.log('currentPageIndex =', this.currentPageIndex);
        // console.log('tableData.length =', this.tableData.length);
        return 0;
      } else if (list.length >= targetPageSize) {
        // if the data is all full page,
        // just let the table think there is more page after it.
        fakeTotal =  (targetPage+2)*targetPageSize;
      } else {
        // if the data is a partial page,
        // tell the table the true data size.
        fakeTotal = (targetPage*targetPageSize)
          +list.length;
      }

      this.tableData = list;
      this.pagination = <TablePaginationConfig>{
        total: fakeTotal,
        current: targetPage +1,
        pageSize: targetPageSize,
        showSizeChanger: false,
        onChange(page, pageSize) {
          switchPage(page);
        },
      };
      this.currentPageIndex = targetPage;
      this.isFetching = false;
      // console.log('pagination =', this.pagination);
      // console.log('currentPageIndex =', this.currentPageIndex);
      // console.log('tableData.length =', this.tableData.length);

      if (isReloading) {
        this.iMessageService.info({ message: 'data reloaded.'});
      }
      return list.length;
    },
    async switchPage(pageNum: number){
      // console.log('switchPage pageNum=', pageNum);
      let count = await this.loadData(pageNum - 1);
      if (count == 0) {
        this.iMessageService.info({ message: 'no more data.'});
      }
    },
  },
};
</script>

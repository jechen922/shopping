<template>
  <div class="my-5 row justify-content-center">
    <nav aria-label="Page navigation example">
      <ul class="pagination">
        <li class="page-item" :class="{'disabled': !page.has_pre }">
          <a class="page-link" href="#" aria-label="Previous" @click.prevent="getList(emitMethod, page.current_page - 1)">
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>
        <li class="page-item"
          v-for="pageNumber in page.total_pages" :key="pageNumber"
          :class="{'active': pageNumber === page.current_page }">
          <a class="page-link" href="#" @click.prevent="getList(emitMethod, pageNumber)">{{pageNumber}}</a>
        </li>
        <li class="page-item" :class="{'disabled': !page.has_next }">
          <a class="page-link" href="#" aria-label="Next" @click.prevent="getList(emitMethod, page.current_page + 1)">
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'pagination',
  props: ['emitMethod', 'page'],
  data () {
    return {
    }
  },
  methods: {
    getList (emitMethod, page) {
      this.$emit(emitMethod, page)
    }
  }
}
</script>

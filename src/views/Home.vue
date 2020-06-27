<template>
    <div class="page-wrapper">
        <div class="container page page-withfooter page-home">
            <div class="page-home-title">
                {{title}}
            </div>
            <div class="page-home-list">
                <el-row :gutter="20">
                    <el-col :xl="6" :lg="6" :md="8" :sm="12" :xs="24" v-for="item in config.packages" :key="item.name" style="transition: 200ms">
                        <PackageCard :pack="item"></PackageCard>
                    </el-col>
                </el-row>
            </div>
        </div>
        <Footer></Footer>
    </div>
</template>

<script>
import config from '../config.json';
import Footer from '../components/Footer';
import PackageCard from '../components/PackageCard';

export default {
    name: 'page.home',
    components: {
        PackageCard,
        Footer
    },
    data() {
        return {
            title: config.title,
            config: config,
        }
    }
}
</script>
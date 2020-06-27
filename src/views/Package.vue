<template>
    <div class="page-wrapper">
        <div class="container page page-pack">
            <div class="page-pack-header">
                <div class="page-pack-header-title">
                    <span>{{packageName}}</span>
                </div>
                <div class="page-pack-header-desc">
                    <span></span>
                </div>
            </div>
            <div class="page-pack-content">
                <el-row>
                    <el-col :span="18">
                        <div class="page-pack-readme" v-if="readme">

                        </div>
                    </el-col>
                    <el-col :span="6">
                        
                    </el-col>
                </el-row>
            </div>
        </div>
    </div>
</template>

<script>
import dayjs from 'dayjs';

const API_URL = 'https://common-api.pwp.app/v1/npm';

export default {
    name: 'page.pack',
    data() {
        return {
            package: {},
            packageName: '',
            readme: null,
            weeklyDownloads: 0,
            homepage: null,
            github: {},
        }
    },
    created() {
        // init datas
        this.packageName = this.$route.params.pack;
        this.axios.get(`${API_URL}/registry`, {
            params: {
                package: this.packageName,
            }
        }).then(res => {
            if (res.data) {
                this.package = res.data.data;
                this.currentVer = this.package.versions[this.package['dist-tags'].latest];
                // readme exists, use it
                if (this.currentVer.readme.length > 0) {
                    this.readme = this.currentVer.readme.length;
                }
                // check if github exists
                if (this.currentVer.repository && this.currentVer.repository.type === 'git' && this.currentVer.repository.url.includes('https://github.com')) {
                    this.github = {
                        url: this.currentVer.repository.url.replace(/^git\+/, '').replace(/\.git$/, ''),
                        name: this.currentVer.repository.url.replace('git+https://github.com/', '').replace(/\.git$/, '')
                    };
                    if (!this.readme) {
                        // get readme from github

                    }
                }
            }
        });
        this.axios.get(`${API_URL}/downloads`, {
            start: dayjs().add(-1, 'week').format('YYYY-MM-DD'),
            end: dayjs.format('YYYY-MM-DD'),
        }).then(res => {
            if (res.data) {
                this.weeklyDownloads = res.data.data.downloads;
            }
        });
    },
}
</script>
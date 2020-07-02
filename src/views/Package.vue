<template>
    <div :class="['page-wrapper', loading ? 'page-loading' : null]" v-loading="loading" v-title="packageName">
        <div class="container page page-withfooter page-pack" v-if="!loading">
            <div class="page-pack-header">
                <div class="page-pack-header-title">
                    <span>{{packageName}}</span>
                    <i class="el-icon-s-home" @click="backHome"></i>
                </div>
                <div class="page-pack-header-desc">
                    <span>{{currentVer ? currentVer.description : null}}</span>
                </div>
                <div class="page-pack-header-tags">
                    <div class="tag tag-author" v-if="currentVer && currentVer.author">
                        <span>{{currentVer.author.name}}</span>
                    </div>
                    <div class="tag tag-version" v-if="currentVer && currentVer.version">
                        <span>{{currentVer.version}}</span>
                    </div>
                    <div class="tag tag-license" v-if="currentVer && currentVer.license">
                        <span>{{currentVer.license}}</span>
                    </div>
                </div>
            </div>
            <div class="page-pack-content">
                <el-row class="page-pack-content-wrapper">
                    <el-col :span="16" class="page-pack-content-left">
                        <div class="page-pack-content-header">
                            <i class="el-icon-document"></i>
                            <span>Readme</span>
                        </div>
                        <div
                            class="markdown page-pack-readme"
                            v-if="readme"
                            v-html="renderedReadme"
                            v-highlight
                        ></div>
                        <p v-else>No content.</p>
                    </el-col>
                    <el-col :span="8" class="page-pack-content-right">
                        <div class="page-pack-content-header">
                            <i class="el-icon-info"></i>
                            <span>Info</span>
                        </div>
                        <TextCard v-if="weeklyDownloads" class="page-pack-card" :text="'Weekly Downloads'" :secondaryText="weeklyDownloads"></TextCard>
                        <TextCard v-if="weeklyDownloads" class="page-pack-card" :text="'Last publish'" :secondaryText="lastPublish"></TextCard>
                        <LinkCard :text="packageName" :link="`https://www.npmjs.com/package/${packageName}`">
                            <template v-slot:icon>
                                <npm></npm>
                            </template>
                        </LinkCard>
                        <LinkCard v-if="github" :text="github ? github.name : null" :link="github ? github.url : null">
                            <template v-slot:icon>
                                <GitHub></GitHub>
                            </template>
                        </LinkCard>
                        <LinkCard v-if="homepage" :text="homepage.text" :link="homepage.url">
                            <template v-slot:icon>
                                <i class="el-icon-s-home"></i>
                            </template>
                        </LinkCard>
                        <div class="page-pack-keywords" v-if="keywords">
                            <div class="page-pack-keywords-title">
                                <span>Keywords</span>
                            </div>
                            <div class="page-pack-keywords-content">
                                <div class="page-pack-keyword" :data-keyword="keyword" v-for="keyword in keywords" :key="keyword" @click="handleTagClick">
                                    <span>{{keyword}}</span>
                                </div>
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </div>
        <Footer v-if="!loading"></Footer>
    </div>
</template>

<script>
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import marked from 'marked';

import Footer from '../components/Footer';
import LinkCard from '../components/LinkCard';
import TextCard from '../components/TextCard';

// icon
import GitHub from '../components/icons/GitHub';
import npm from '../components/icons/npm';

const API_URL = 'https://common-api.pwp.app/v1';

dayjs.locale('zh-CN');
dayjs.extend(relativeTime);

export default {
    name: 'page.pack',
    components: {
        LinkCard,
        TextCard,
        Footer,
        GitHub,
        npm
    },
    data() {
        return {
            package: {},
            packageName: '',
            readme: null,
            weeklyDownloads: 0,
            homepage: null,
            github: null,
            homepage: null,
            keywords: null,
            currentVer: null,
            loading: true,
        }
    },
    created() {
        // init datas
        this.packageName = this.$route.params.pack;
        this.axios.get(`${API_URL}/npm/registry`, {
            params: {
                package: this.packageName,
            }
        }).then(res => {
            if (!res.data) {
                this.error = true;
                return;
            }
            this.package = res.data.data;
            this.currentVer = this.package.versions[this.package['dist-tags'].latest];
            if (this.currentVer.homepage) {
                this.homepage = {
                    text: this.currentVer.homepage.replace(/^(https?:\/\/)/, ''),
                    url: this.currentVer.homepage
                }
            }
            // readme exists, use it
            if (this.package.readme) {
                this.readme = this.package.readme;
            }
            // set keywords
            if (this.package.keywords) {
                this.keywords = this.package.keywords;
            }
            // check if github exists
            if (this.currentVer.repository && this.currentVer.repository.type === 'git' && this.currentVer.repository.url.includes('https://github.com')) {
                this.github = {
                    url: this.currentVer.repository.url.replace(/^git\+/, '').replace(/\.git$/, ''),
                    name: this.currentVer.repository.url.replace('git+https://github.com/', '').replace(/\.git$/, '')
                };
                if (!this.readme) {
                    // get readme from github
                    this.axios.get(`${API_URL}/github/readme`, {
                        params: {
                            repo: this.github.name
                        }
                    }).then(res => {
                        if (res.data) {
                            this.readme = res.data.data;
                        }
                        this.loading = false;
                    })
                }
            }
            if (this.readme) {
                this.loading = false;
            }
        }, () => {
            this.error = true;
        });
        this.axios.get(`${API_URL}/npm/downloads`, {
            params: {
                start: dayjs().add(-1, 'week').format('YYYY-MM-DD'),
                end: dayjs().format('YYYY-MM-DD'),
                package: this.packageName,
            }
        }).then(res => {
            if (res.data) {
                this.weeklyDownloads = res.data.data.downloads;
            }
        });
    },
    computed: {
        renderedReadme() {
            return marked(this.readme);
        },
        lastPublish() {
            if (!this.package || !this.package.time) {
                return '-';
            }
            return dayjs(this.package.time.modified).toNow(true) + ' ago';
        }
    },
    methods: {
        backHome() {
            this.$router.push('/');
        },
        handleTagClick(e) {
            const keyword = e.currentTarget.dataset.keyword;
            window.open(`https://www.npmjs.com/search?q=keywords:${keyword}`);
        }
    }
}
</script>
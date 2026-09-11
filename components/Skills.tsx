'use client'

import { useRef } from 'react'
import { useCloudTagAnimation } from './useCloudTagAnimation'

const SKILL_TAG_DATA = [
  { name: 'React.js', src: 'react.png' },
  { name: 'Next.js', src: 'next.png' },
  { name: 'JavaScript', src: 'js.png' },
  { name: 'TypeScript', src: 'TS.png' },
  { name: 'HTML5', src: 'html.png' },
  { name: 'CSS3', src: 'css.png' },
  { name: 'Tailwind CSS', src: 'tailwind.png' },
  { name: 'Bootstrap', src: 'bootstrap.png' },
  { name: 'Material UI', src: 'material.png' },
  { name: 'Node.js', src: 'node.png' },
  { name: 'Express.js', src: 'express.png' },
  { name: 'NestJS', src: 'nest.png' },
  { name: 'Vue.js', src: 'Vue.png' },
  { name: 'Nuxt.js', src: 'nuxt.png' },
  { name: 'Angular', src: 'Angular.png' },
  { name: 'Astro', src: 'Astro.png' },
  { name: 'Vite', src: 'Vite.png' },
  { name: 'Webpack', src: 'webpack.png' },
  { name: 'Python', src: 'Python.png' },
  { name: 'Django', src: 'Django.png' },
  { name: 'Java', src: 'Java.png' },
  { name: 'Spring Boot', src: 'Springboot.png' },
  { name: 'PHP', src: 'php.png' },
  { name: 'Laravel', src: 'Laravel.png' },
  { name: 'MongoDB', src: 'MonggoDB.png' },
  { name: 'PostgreSQL', src: 'PostgreSQL.png' },
  { name: 'MySQL', src: 'Mysq.png' },
  { name: 'SQLite', src: 'SQLite.png' },
  { name: 'Prisma ORM', src: 'Prisma.png' },
  { name: 'Axios', src: 'Axios.png' },
  { name: 'Git', src: 'git.png' },
  { name: 'GitHub', src: 'github.png' },
  { name: 'GitHub Copilot', src: 'githu-copilot.png' },
  { name: 'Claude AI', src: 'claude.png' },
  { name: 'Cursor IDE', src: 'cursor.png' },
  { name: 'Cline AI', src: 'cline.png' },
  { name: 'OpenAI Codex', src: 'codex-openai.png' },
  { name: 'Anti-Gravity AI', src: 'Anti-gravity.png' },
  { name: 'Figma', src: 'figma.png' },
  { name: 'Photoshop', src: 'ps.png' },
  { name: 'Illustrator', src: 'ai.png' },
  { name: 'Adobe XD', src: 'xd.png' },
  { name: 'After Effects', src: 'Ae.png' },
  { name: 'Premiere Pro', src: 'PR.png' },
  { name: 'Lightroom', src: 'lr.png' },
  { name: 'InDesign', src: 'Id.png' },
  { name: 'Dreamweaver', src: 'dw.png' },
  { name: 'WordPress', src: 'wordpress.png' },
  { name: 'Elementor', src: 'elementor.png' },
  { name: 'WooCommerce', src: 'woo.png' },
  { name: 'SharePoint', src: 'sharepoint.png' },
  { name: 'Sitefinity', src: 'sitefinity.png' },
  { name: 'Adobe AEM', src: 'aem.png' },
]

export default function Skills() {
  const cloudRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)

  useCloudTagAnimation(cloudRef, tooltipRef)

  return (
    <section id="skills" className="skills">
      <div className="container">
        <div className="text-center">
          <div className="container_title">
            <div className="Title">
              <h1 className="Title_h1">
                TECH STACK
                <div className="Title__highlight"></div>
              </h1>
              <div className="Title__underline"></div>
              <div aria-hidden className="Title__filled">TECH STACK</div>
            </div>
          </div>
          <div className="height_divider_1"></div>
        </div>
      </div>

      <div className="container">
        <div className="row skills_v29-row_v3">
          <h3 style={{ textAlign: 'center' }}>BACK-END</h3>
          <div className="col-xs-12 col-sm-6 col-lg-4 skill-col_v3">
            <div className="profile-skills_v29">
              <div className="profile-skills_v3">
                <ul className="skills_v29 skills1_v3">
                  <li className="sk-pro_v29"><span>PHP</span></li>
                  <li className="sk-dis_v29"><span>JAVA</span></li>
                  <li className="sk-dtb_v29"><span>Python</span></li>
                  <li className="sk-cms_v29"><span>Apache HTTP Server</span></li>
                  <li className="sk-dtb_v29"><span>NodeJS</span></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-xs-12 col-sm-6 col-lg-4 skill-col_v3">
            <div className="profile-skills_v29">
              <div className="profile-skills_v3">
                <ul className="skills_v29 skills1_v3">
                  <li className="sk-gim_v29"><span>LARAVEL</span></li>
                  <li className="sk-ani_v29"><span>Springboot</span></li>
                  <li className="sk-dtb_v29"><span>Django</span></li>
                  <li className="sk-gim_v29"><span>ExpressJS</span></li>
                  <li className="sk-ani_v29"><span>MCP</span></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-xs-12 col-sm-6 col-lg-4 skill-col_v3">
            <div className="profile-skills_v29">
              <div className="profile-skills_v3">
                <ul className="skills_v29 skills1_v3">
                  <li className="sk-gim_v29"><span>NestJS</span></li>
                  <li className="sk-pro_v29"><span>JQuery</span></li>
                  <li className="sk-ani_v29"><span>RestAPI</span></li>
                  <li className="sk-dis_v29"><span>Firebase</span></li>
                  <li className="sk-dis_v29"><span>Supabase</span></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="row skills_v29-row_v3">
          <h3 style={{ textAlign: 'center' }}>FRONT-END</h3>
          <div className="col-xs-12 col-sm-6 col-lg-4 skill-col_v3">
            <div className="profile-skills_v29">
              <div className="profile-skills_v3">
                <ul className="skills_v29 skills1_v3">
                  <li className="sk-tre_v29"><span>React</span></li>
                  <li className="sk-dis_v29"><span>Svelte</span></li>
                  <li className="sk-wor_v29"><span>TAILWIND</span></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-xs-12 col-sm-6 col-lg-4 skill-col_v3">
            <div className="profile-skills_v29">
              <div className="profile-skills_v3">
                <ul className="skills_v29 skills1_v3">
                  <li className="sk-gim_v29"><span>Vue</span></li>
                  <li className="sk-dis_v29"><span>Astro</span></li>
                  <li className="sk-css_v29"><span>Progressive Web App (PWA)</span></li>
                  <li className="sk-tre_v29"><span>PRIMENG</span></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-xs-12 col-sm-6 col-lg-4 skill-col_v3">
            <div className="profile-skills_v29">
              <div className="profile-skills_v3">
                <ul className="skills_v29 skills1_v3">
                  <li className="sk-wor_v29"><span>Angular</span></li>
                  <li className="sk-pro_v29"><span>JQuery</span></li>
                  <li className="sk-htm_v29"><span>BOOTSTRAP</span></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="row skills_v29-row_v3">
          <h3 style={{ textAlign: 'center' }}>FULLSTACK</h3>
          <div className="col-xs-12 col-sm-6 col-lg-4 skill-col_v3">
            <div className="profile-skills_v29">
              <div className="profile-skills_v3">
                <ul className="skills_v29 skills1_v3">
                  <li className="sk-tre_v29"><span>NextJS</span></li>
                  <li className="sk-dis_v29"><span>JSON Web Token (JWT)</span></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-xs-12 col-sm-6 col-lg-4 skill-col_v3">
            <div className="profile-skills_v29">
              <div className="profile-skills_v3">
                <ul className="skills_v29 skills1_v3">
                  <li className="sk-dis_v29"><span>NuxtJS</span></li>
                  <li className="sk-css_v29"><span>Progressive Web App (PWA)</span></li>
                  <li className="sk-cms_v29"><span>OAuth 2.0</span></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-xs-12 col-sm-6 col-lg-4 skill-col_v3">
            <div className="profile-skills_v29">
              <div className="profile-skills_v3">
                <ul className="skills_v29 skills1_v3">
                  <li className="sk-cms_v29"><span>Tanstack</span></li>
                  <li className="sk-gim_v29"><span>TYPESCRIPT</span></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="row skills_v29-row_v3">
          <h3 style={{ textAlign: 'center' }}>DEVOPS</h3>
          <div className="col-xs-12 col-sm-6 col-lg-4 skill-col_v3">
            <div className="profile-skills_v29">
              <div className="profile-skills_v3">
                <ul className="skills_v29 skills1_v3">
                  <li className="sk-gim_v29"><span>jenkins</span></li>
                  <li className="sk-tre_v29"><span>Jira</span></li>
                  <li className="sk-dis_v29"><span>GRAFANA</span></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-xs-12 col-sm-6 col-lg-4 skill-col_v3">
            <div className="profile-skills_v29">
              <div className="profile-skills_v3">
                <ul className="skills_v29 skills1_v3">
                  <li className="sk-gim_v29"><span>Git</span></li>
                  <li className="sk-ani_v29"><span>Docker</span></li>
                  <li className="sk-tre_v29"><span>Azure DevOps Server(TFS)</span></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-xs-12 col-sm-6 col-lg-4 skill-col_v3">
            <div className="profile-skills_v29">
              <div className="profile-skills_v3">
                <ul className="skills_v29 skills1_v3">
                  <li className="sk-pro_v29"><span>Github</span></li>
                  <li className="sk-pro_v29"><span>Gitlab</span></li>
                  <li className="sk-dis_v29"><span>PROMETHEUS</span></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="row skills_v29-row_v3">
          <h3 style={{ textAlign: 'center' }}>AI TOOLS</h3>
          <div className="col-xs-12 col-sm-6 col-lg-4 skill-col_v3">
            <div className="profile-skills_v29">
              <div className="profile-skills_v3">
                <ul className="skills_v29 skills1_v3">
                  <li className="sk-cms_v29"><span>LANGCHAIN</span></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-xs-12 col-sm-6 col-lg-4 skill-col_v3">
            <div className="profile-skills_v29">
              <div className="profile-skills_v3">
                <ul className="skills_v29 skills1_v3">
                  <li className="sk-ani_v29"><span>LANGSMITH</span></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-xs-12 col-sm-6 col-lg-4 skill-col_v3">
            <div className="profile-skills_v29">
              <div className="profile-skills_v3">
                <ul className="skills_v29 skills1_v3">
                  <li className="sk-dis_v29"><span>OLLAMA</span></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="row skills_v29-row_v3">
          <h3 style={{ textAlign: 'center' }}>DATABASE</h3>
          <div className="row skills_v29-row_v3">
            <div className="col-xs-12 col-sm-6 col-lg-4 skill-col_v3">
              <div className="profile-skills_v29">
                <div className="profile-skills_v3">
                  <ul className="skills_v29 skills1_v3">
                    <li className="sk-php_v29"><span>MySQL</span></li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-xs-12 col-sm-6 col-lg-4 skill-col_v3">
              <div className="profile-skills_v29">
                <div className="profile-skills_v3">
                  <ul className="skills_v29 skills1_v3">
                    <li className="sk-sql_v29"><span>MongoDB</span></li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-xs-12 col-sm-6 col-sm-offset-3 col-lg-4 col-lg-offset-0 skill-col_v3">
              <div className="profile-skills_v29">
                <div className="profile-skills_v3">
                  <ul className="skills_v29 skills1_v3">
                    <li className="sk-pug_v29"><span>POSTGRESQL</span></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row skills_v29-row_v3">
          <h3 style={{ textAlign: 'center' }}>CMS</h3>
          <div className="row skills_v29-row_v3">
            <div className="col-xs-12 col-sm-6 col-lg-4 skill-col_v3">
              <div className="profile-skills_v29">
                <div className="profile-skills_v3">
                  <ul className="skills_v29 skills1_v3">
                    <li className="sk-tre_v29"><span>Wordpress</span></li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-xs-12 col-sm-6 col-lg-4 skill-col_v3">
              <div className="profile-skills_v29">
                <div className="profile-skills_v3">
                  <ul className="skills_v29 skills1_v3">
                    <li className="sk-not_v29"><span>Adobe Experience Manager</span></li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-xs-12 col-sm-6 col-sm-offset-3 col-lg-4 col-lg-offset-0 skill-col_v3">
              <div className="profile-skills_v29">
                <div className="profile-skills_v3">
                  <ul className="skills_v29 skills1_v3">
                    <li className="sk-wor_v29"><span>Sharepoint</span></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row skills_v29-row_v3">
          <h3 style={{ textAlign: 'center' }}>SOFTWARE</h3>
          <div className="row skills_v29-row_v3">
            <div className="col-xs-12 col-sm-6 col-lg-4 skill-col_v3">
              <div className="profile-skills_v29">
                <div className="profile-skills_v3">
                  <ul className="skills_v29 skills1_v3">
                    <li className="sk-tre_v29"><span>PHOTOSHOP</span></li>
                    <li className="sk-dtb_v29"><span>PREMIERE PRO</span></li>
                    <li className="sk-dis_v29"><span>AFTER EFFECTS</span></li>
                    <li className="sk-pro_v29"><span>PRO CREATE</span></li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-xs-12 col-sm-6 col-lg-4 skill-col_v3">
              <div className="profile-skills_v29">
                <div className="profile-skills_v3">
                  <ul className="skills_v29 skills1_v3">
                    <li className="sk-res_v29"><span>ILLUSTRATOR</span></li>
                    <li className="sk-tre_v29"><span>INDESIGN</span></li>
                    <li className="sk-tri_v29"><span>FIGMA</span></li>
                    <li className="sk-dis_v29"><span>CINEMA4D</span></li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-xs-12 col-sm-6 col-sm-offset-3 col-lg-4 col-lg-offset-0 skill-col_v3">
              <div className="profile-skills_v29">
                <div className="profile-skills_v3">
                  <ul className="skills_v29 skills1_v3">
                    <li className="sk-pro_v29"><span>DREAMWEAVER</span></li>
                    <li className="sk-dtb_v29"><span>XD</span></li>
                    <li className="sk-gim_v29"><span>BALSAMIQ</span></li>
                    <li className="sk-cms_v29"><span>SONY VEGAS PRO</span></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row skills_v29-row_v3">
          <h3 style={{ textAlign: 'center' }}>DEVELOPER TOOLS &amp; PLATFORMS</h3>
          <div className="row skills_v29-row_v3">
            <div className="col-xs-12 col-sm-6 col-lg-4 skill-col_v3">
              <div className="profile-skills_v29">
                <div className="profile-skills_v3">
                  <ul className="skills_v29 skills1_v3">
                    <li className="sk-not_v29"><span>GITHUB COPILOT</span></li>
                    <li className="sk-tre_v29"><span>Cursor</span></li>
                    <li className="sk-dtb_v29"><span>DeepSeek Harness</span></li>
                    <li className="sk-dis_v29"><span>N8N</span></li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-xs-12 col-sm-6 col-lg-4 skill-col_v3">
              <div className="profile-skills_v29">
                <div className="profile-skills_v3">
                  <ul className="skills_v29 skills1_v3">
                    <li className="sk-not_v29"><span>CLAUDE CODE</span></li>
                    <li className="sk-not_v29"><span>AntiGravity</span></li>
                    <li className="sk-dtb_v29"><span>Unsloth</span></li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-xs-12 col-sm-6 col-sm-offset-3 col-lg-4 col-lg-offset-0 skill-col_v3">
              <div className="profile-skills_v29">
                <div className="profile-skills_v3">
                  <ul className="skills_v29 skills1_v3">
                    <li className="sk-gim_v29"><span>CLINE</span></li>
                    <li className="sk-dtb_v29"><span>Devin</span></li>
                    <li className="sk-not_v29"><span>OmniRoute</span></li>
                    <li className="sk-dtb_v29"><span>OPENROUTER</span></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <br /><br /><br /><br /><br />

      {/* Tag cloud */}
      <div className="container_cloud">
        <div id="cl" className="cloud" ref={cloudRef}>
          <div className="cloud-tooltip" ref={tooltipRef}></div>
          {SKILL_TAG_DATA.map((item, i) => (
            <div className="cloud-element" key={i}>
              <img
                src={`/assets/img/skills/${item.src}`}
                alt={item.name}
                title={item.name}
                data-name={item.name}
                width="50"
                height="50"
                loading="lazy"
                decoding="async"
              />
            </div>
          ))}
        </div>
        <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
      </div>
      <div className="group">
        <div className="is-floated"></div>
        <div className="is-floated"></div>
        <div className="is-floated"></div>
      </div>
    </section>
  )
}

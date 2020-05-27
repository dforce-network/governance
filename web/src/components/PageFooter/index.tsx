import React from 'react';
import styles from './index.less';
import { message, Dropdown, Menu } from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { formatMessage, setLocale } from 'umi-plugin-locale';

const iconTwitter = require('@assets/icon_twitter.svg');
const iconTelegram = require('@assets/icon_telegram.svg');
const iconMedium = require('@assets/icon_medium.svg');
const iconReddit = require('@assets/icon_reddit.svg');
const iconDiscord = require('@assets/icon_discord.svg');
const iconLinkedin = require('@assets/icon_linkedin.svg');
const iconYoutube = require('@assets/icon_youtube.svg');
const iconWechat = require('@assets/icon_wechat.svg');
const iconWechatQRCode = require('@assets/wechat.png');

interface PageFooterProps {
  className?: string;
}

const PageFooter: React.FC<PageFooterProps> = (props) => {
  let currentLanguage = 'en-US';

  const changeLanguage = (language: string) => {};

  return (
    <div className={styles.footer}>
      <section className={styles.footer__link}>
        <h2>{ formatMessage({ id: 'footer.resource.title' }) }</h2>
        <a href="https://github.com/dforce-network/USR" target="_blank">{ formatMessage({ id: 'footer.resource.github' }) }</a>
        <a href="https://github.com/dforce-network/USR" target="_blank">{ formatMessage({ id: 'footer.resource.faq' }) }</a>
      </section>

      <section className={styles.footer__community}>
        <h2>{ formatMessage({ id: 'footer.community.title' }) }</h2>
        <div>
          <a href="https://twitter.com/dForcenet" target="_blank">
            <img src={iconTwitter} alt="twitter" />
          </a>
          <a href="https://t.me/dforcenet" target="_blank">
            <img src={iconTelegram} alt="telegram" />
          </a>
          <a href="https://medium.com/dforcenet" target="_blank">
            <img src={iconMedium} alt="medium" />
          </a>
          <a href="https://www.reddit.com/r/dForceNetwork" target="_blank">
            <img src={iconReddit} alt="reddit" />
          </a>
          <a href="https://discord.gg/Gbtd3MR" target="_blank">
            <img src={iconDiscord} alt="discord" />
          </a>
          <a href="https://www.linkedin.com/company/dforce-network" target="_blank">
            <img src={iconLinkedin} alt="linkedin" />
          </a>
          <a href="https://www.youtube.com/channel/UCM6Vgoc-BhFGG11ZndUr6Ow" target="_blank">
            <img src={iconYoutube} alt="youtube" />
          </a>
          {
            ['en', 'en-US'].indexOf(currentLanguage) >= 0
              ? null
              : (
                <a className={styles.footer__community_wechat} target="_blank">
                  <img src={iconWechat} alt="wechat" />
                  <img className={styles.footer__community_wechat_qr} src={iconWechatQRCode} alt="wechat" />
                </a>
              )
          }
        </div>

        <Dropdown
          placement="topCenter"
          overlay={(
            <Menu style={{ width: '100px' }}>
              <Menu.Item onClick={changeLanguage('zh')}>{ formatMessage({ id: 'footer.community.chinese' }) }</Menu.Item>
              <Menu.Item onClick={changeLanguage('en')}>{ formatMessage({ id: 'footer.community.english' }) }</Menu.Item>
            </Menu>
          )}
        >
          <label className={styles.footer__community_language}>
            { currentLanguage === 'en' ? formatMessage({ id: 'footer.community.english' }) : formatMessage({ id: 'footer.community.chinese' }) }
            <img src={require('@assets/icon_language_down.svg')} />
          </label>
        </Dropdown>
      </section>

      <section className={styles.footer__email}>
        <h2>{ formatMessage({ id: 'footer.contact.title' }) }</h2>
        <CopyToClipboard
          text={'contacts@dforce.network'}
          onCopy={() => {
            message.success(formatMessage({ id: 'footer.copied' }), 4);
          }}
        >
          <span>contacts@dforce.network</span>
        </CopyToClipboard>
        <CopyToClipboard
          text={'bd@dforce.network'}
          onCopy={() => {
            message.success(formatMessage({ id: 'footer.copied' }), 4);
          }}
        >
          <span>bd@dforce.network</span>
        </CopyToClipboard>
        <CopyToClipboard
          text={'tech@dforce.network'}
          onCopy={() => {
            message.success(formatMessage({ id: 'footer.copied' }), 4);
          }}
        >
          <span>tech@dforce.network</span>
        </CopyToClipboard>
      </section>
    </div>
  );
};

export default PageFooter;

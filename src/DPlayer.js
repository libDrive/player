import React from "react";
import clsx from 'clsx';
import omit from 'omit.js';
import DPlayer from 'libdrive-dplayer';

const events = [
  "abort", "canplay", "canplaythrough",
  "durationchange", "emptied", "ended",
  "error", "loadeddata", "loadedmetadata",
  "loadstart", "mozaudioavailable", "pause",
  "play", "playing", "progress", "ratechange",
  "seeked", "seeking", "stalled", "suspend",
  "timeupdate", "volumechange", "waiting",
  "screenshot", "thumbnails_show", "thumbnails_hide",
  "danmaku_show", "danmaku_hide", "danmaku_clear",
  "danmaku_loaded", "danmaku_send", "danmaku_opacity",
  "contextmenu_show", "contextmenu_hide", "notice_show",
  "notice_hide", "quality_start", "quality_end",
  "destroy", "resize", "fullscreen", "fullscreen_cancel",
  "subtitle_show", "subtitle_hide", "subtitle_change"
];
const capitalize = function (str) {
  return `${str.charAt(0).toUpperCase()}${str.substring(1)}`;
};
const capitalizeEventName = function (str) {
  return str.split('_').map(capitalize).join('');
};
const eventsProps = events.map(eventName => ({ eventName, prop: `on${capitalizeEventName(eventName)}` }))

class DPlayerComponent extends React.Component {

  constructor(props, context) {
    super(props, context);
  }

  componentDidMount() {
    let { onLoad, options } = this.props;
    //new player
    const player = this.dp = new DPlayer({
      ...Object.assign({}, {
        lang: 'en',
        contextmenu: [
          {
            text: "GitHub",
            link: "https://github.com/libDrive/libDrive",
          },
          {
            text: "Author",
            link: "https://elias.eu.org",
          },
        ],
      }, options),
      container: this.container
    });
    //run load
    onLoad && onLoad(player);
    //bind player events
    eventsProps.forEach(({ eventName, prop }) => {
      if (prop in this.props) {
        player.on(eventName, this.props[prop])
      }
    })
  }

  render() {
    const { className, ...otherProps } = this.props;
    const resetProps = omit(otherProps, ['options', 'onLoad', ...eventsProps.map(ev => ev.prop)])
    const wrapperClassName = clsx({
      [`dplayer`]: true,
      [`${className}`]: !!className,
    });
    return <div ref={ref => this.container = ref} className={wrapperClassName} {...resetProps} />;
  }
}

export default DPlayerComponent;
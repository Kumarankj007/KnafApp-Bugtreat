import {View, Text, Dimensions} from 'react-native';
import React from 'react';
import IframeRenderer, {iframeModel} from '@native-html/iframe-plugin';
import TableRenderer, {tableModel} from '@native-html/table-plugin';
import WebView from 'react-native-webview';
import RenderHTML, {
  HTMLContentModel,
  HTMLElementModel,
} from 'react-native-render-html';
import Videos from 'react-native-video';
import {appColors} from '../../utilities/appColors';
import {appFont} from '../../utilities/appFonts';
import {fontScalling} from '../../utilities/HelpeFunction';

const {width, height} = Dimensions.get('screen');

export default function HtmlView({url, altStyle, propswidth}) {
  const customHTMLElementModels = {
    html: HTMLElementModel.fromCustomModel({
      tagName: 'html',
      contentModel: HTMLContentModel.mixed,
    }),
    link: HTMLElementModel.fromCustomModel({
      tagName: 'link',
      contentModel: HTMLContentModel.mixed,
    }),
    font: HTMLElementModel.fromCustomModel({
      tagName: 'font',
      contentModel: HTMLContentModel.mixed,
    }),
    embed: HTMLElementModel.fromCustomModel({
      tagName: 'embed',
      contentModel: HTMLContentModel.mixed,
    }),
    ul: HTMLElementModel.fromCustomModel({
      tagName: 'ul',
      contentModel: HTMLContentModel.mixed,
    }),
    iframe: iframeModel,
    table: tableModel,
    webViewProps: {
      allowsFullScreen: true,
      androidLayerType: 'software',
      allowsFullscreenVideo: true,
      scalesPageToFit: true,
      textSelectable: true,
    },
    video: HTMLElementModel.fromCustomModel({
      tagName: 'video',
      contentModel: HTMLContentModel.block,
      isVoid: false,
    }),
  };

  const renderers = {
    iframe: IframeRenderer,
    table: TableRenderer,
    video: ({TDefaultRenderer, ...props}) => {
      return <Videos source={{uri: props.tnode.init.domNode.attribs.src}} />;
    },
  };
  return (
    <View style={altStyle}>
      <RenderHTML
        renderers={renderers}
        defaultTextProps={{selectable: true}}
        source={{html: `${url}`}}
        contentWidth={width}
        tagsStyles={{
          body: {
            whiteSpace: 'normal',
            color: appColors.textBlack,
            fontFamily: appFont.Lato_Regular,
            fontSize: fontScalling(1.8),
            lineHeight: fontScalling(2.2),
            width: propswidth ? propswidth : width - 40,
            // overflow: 'hidden',
          },
          img: {
            // width: width - 40,
            resizeMode: 'contain',
            borderRadius: 10,
          },
          p: {
            width: '100%',
            alignSelf: 'center',
          },
          iframe: {
            alignSelf: 'center',
            opacity: 0.99,
            height: 250,
          },
          video: {
            width: '100%',
            alignSelf: 'center',
          },
          table: {
            alignSelf: 'center',
            width: '100%',
          },
        }}
        renderersProps={{
          iframe: {
            scalesPageToFit: true,
            webViewProps: {
              allowsFullScreen: true,
              androidLayerType: 'software',
              textSelectable: true,
            },
          },
        }}
        customHTMLElementModels={customHTMLElementModels}
        WebView={WebView}
      />
    </View>
  );
}

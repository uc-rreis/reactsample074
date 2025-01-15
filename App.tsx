/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {
  UsercentricsOptions,
  UsercentricsLoggerLevel,
  Usercentrics,
  BannerSettings,
  UsercentricsLayout,
  SectionAlignment,
  ButtonLayout,
  ButtonType,
  LegalLinksSettings,
  UsercentricsConsentUserResponse,
  BannerLogo,
} from '@usercentrics/react-native-sdk';
import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  Button,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {Colors, Header} from 'react-native/Libraries/NewAppScreen';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

const Separator = () => <View style={styles.separator} />;

function Section({children, title}: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

const settingsId = '3k3ooX9lEOzlnE';

function App(): React.JSX.Element {
  React.useEffect(() => {
    let options: UsercentricsOptions = {settingsId: settingsId};
    options.loggerLevel = UsercentricsLoggerLevel.debug;
    options.consentMediation = false;
    Usercentrics.configure(options);
    showBanner();
  }, [showBanner]);

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const bannerSettingsCustom: BannerSettings = {
    firstLayerStyleSettings: {
      layout: UsercentricsLayout.popupCenter,
      cornerRadius: 30.0,
      title: {
        textSize: 20.0,
        textAlignment: SectionAlignment.center,
        textColorHex: '000000',
      },
      message: {
        textSize: 16.0,
        textAlignment: SectionAlignment.left,
        textColorHex: '181818',
        linkTextColorHex: '000000',
        linkTextUnderline: true,
      },
      buttonLayout: ButtonLayout.row([
        {
          buttonType: ButtonType.acceptAll,
          cornerRadius: 30.0,
        },
        {
          buttonType: ButtonType.more,
          backgroundColorHex: '#E8D9D5',
          textColorHex: '#FF6D4A',
        },
      ]),
    },
    secondLayerStyleSettings: {
      showCloseButton: true,
    },
    generalStyleSettings: {
      layerBackgroundColorHex: '#E3FEE8',
      font: {
        regularFont: 'Lora',
        boldFont: 'Lora-Regular_Bold',
        fontSize: 12.0,
      },
      logo: createBannerLogo(),
      links: LegalLinksSettings.both,
      disableSystemBackButton: false,
    },
  };

  function createBannerLogo(): BannerLogo {
    // Logo name is used for iOS and the Image.resolveAssetSource is used for Android.
    const customLogo = new BannerLogo(
      'logo.png',
      Image.resolveAssetSource(require('./assets/images/logo.png')),
    );
    console.log(
      `customLOGO ----- logoName: ${customLogo.logoName} -- logoPath: ${customLogo.logoPath}`,
    );
    return customLogo;
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  async function showBanner() {
    try {
      const status = await Usercentrics.status();
      if (status.shouldCollectConsent) {
        // Show banner to collect consent
        showFirstLayer();
      } else {
        // Apply consent with status.consents
      }
    } catch (error) {
      // Handle error
    }
  }

  async function showFirstLayer() {
    const response = await Usercentrics.showFirstLayer(bannerSettingsCustom);
    consentsLogger(response);
  }

  async function showSecondLayer() {
    const response = await Usercentrics.showSecondLayer();
    consentsLogger(response);
  }

  async function consentsLogger(response: UsercentricsConsentUserResponse) {
    console.log('Consents -> ${response.consents}', response.consents);

    const tcfData = await Usercentrics.getTCFData();
    const tcString = tcfData.tcString;
    console.log('TCSTRING - > ${tcString}', tcString);

    console.log(
      'User Interaction -> ${response.userInteraction}',
      response.userInteraction,
    );
    console.log(
      'Controller Id -> ${response.controllerId}',
      response.controllerId,
    );

    let data = Usercentrics.getCMPData();
    let categories = (await data).categories;
    let services = (await data).services;
    console.log('CATEGORIES');
    console.log(categories);
    console.log('SERVICES');
    console.log(services);
  }

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="First Layer">
            Open the First Layer {'\n\n'}
            <View style={styles.button}>
              <Button
                onPress={async () => {
                  showFirstLayer();
                }}
                title="Show First Layer"
              />
            </View>
          </Section>
          <Separator />
          <Section title="Second Layer">
            Open the Second Layer {'\n\n'}
            <View style={styles.button}>
              <Button
                onPress={async () => {
                  showSecondLayer();
                }}
                title="Show Second Layer"
              />
            </View>
          </Section>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  separator: {
    marginVertical: 30,
    borderBottomColor: '#737373',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  button: {
    marginTop: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1b75d0',
    color: '#fff',
  },
});

export default App;

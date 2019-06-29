function BoldDigitalSettings(props) {
    return (
      <Page>
        <Section
          title={<Text bold align="center">Color Settings</Text>}>
          <ColorSelect
            settingsKey="themeColor"
            colors={[
                {color: 'red'},
                {color: 'tomato'},
                {color: 'orange'},
                {color: 'sandybrown'},
                {color: 'peachpuff'},
                {color: 'lightpink'},
                {color: 'palegoldenrod'},
                {color: 'gold'},
                {color: 'palegreen'},
                {color: 'aquamarine'},
                {color: 'cyan'},
                {color: 'skyblue'},
                {color: 'dodgerblue'},
                {color: 'deepskyblue'},
                {color: 'blueviolet'},
                {color: 'violet'},
                {color: 'hotpink'},
                {color: 'plum'}
            ]}
          />
        </Section>
      </Page>
    );
  }
  
  registerSettingsPage(BoldDigitalSettings);
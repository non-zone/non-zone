import * as React from 'react';
import { View } from 'react-native';

export default function Line(props) {
    let { thickness, marginTop, marginBottom, marginLeft, marginRight } = props;
    thickness = thickness != null ? thickness : 3;
    marginTop = marginTop != null ? marginTop : 20;
    marginBottom = marginBottom != null ? marginBottom : 20;
    marginLeft = marginLeft != null ? marginLeft : 20;
    marginRight = marginRight != null ? marginRight : 20;

    return (
        <View
            style={{
                borderBottomColor: 'white',
                borderBottomWidth: thickness,
                marginTop: marginTop,
                marginBottom: marginBottom,
                marginLeft: marginLeft,
                marginRight: marginRight,
            }}
        />
    );
}

import React, { Component, useRef, useState, useEffect } from 'react';
import { SafeAreaView, Text, Alert, AppState, BackHandler } from 'react-native';
import { useState } from 'react';

import {
  BarcodeCaptureSettings,
  BarcodeCaptureOverlay,
  BarcodeCaptureOverlayStyle,
  BarcodeCaptureSettings,
  Symbology,
  SymbologyDescription,
  BarcodeCapture,
} from 'scandit-react-native-datacapture-barcode';

import {
  Camera,
  CameraSettings,
  DataCaptureContext,
  DataCaptureView,
  FrameSourceState,
  RectangularViewfinder,
  RectangularViewfinderStyle,
  RectangularViewfinderLineStyle,
  VideoResolution,
} from 'scandit-react-native-datacapture-core';

const App = () => {

  const [selectionType, setSelectionType] = SelectionType.tap;
  const [result, setResult] = useState(null);

  const viewRef = useRef(null);
  const context = DataCaptureContext.forLicenseKey('');

  const settings = new BarcodeCaptureSettings()
  settings.enableSymbologies([
    Symbology.EAN13UPCA,
    Symbology.EAN8,
    Symbology.UPCE,
    Symbology.QR,
    Symbology.DataMatrix,
    Symbology.Code39,
    Symbology.Code128,
    Symbology.InterleavedTwoOfFive,
  ]);
  const barcodeCapture = BarcodeCapture.forContext(context, settings);
  const listener = {
    didScan: (barcodeCapture, session) => {
      const recognizedBarcodes = session.newlyRecognizedBarcodes;
      console.log(recognizedBarcodes + ' heck you')
    }
  }
  barcodeCapture.addListener(listener);
  const cameraSettings = BarcodeCapture.cameraSettings;
  const camera = Camera.default;
  if (camera) {
    camera.applySettings(cameraSettings);
  }
  context.setFrameSource(camera);
  camera.switchToDesiredState(FrameSourceState.On);

  const startCapture = () => {
    startCamera();
    barcodeCaptureMode.isEnabled = true;
  }

  const handleAppStateChange = async () => {
    if (nextAppState.match(/inactive|background/)) {
      stopCapture()
    } else {
      startCapture()
    }
  }

  return (
    <></>
  )

}

export default App;
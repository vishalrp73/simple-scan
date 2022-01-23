import React, { useRef, useEffect } from 'react';
import { Alert, AppState, BackHandler } from 'react-native';

import {
    BarcodeCapture,
    BarcodeCaptureOverlay,
    BarcodeCaptureOverlayStyle,
    BarcodeCaptureSettings,
    Symbology,
    SymbologyDescription
} from 'scandit-react-native-datacapture-barcode';

import {
    Camera,
    CameraSettings,
    DataCaptureContext,
    DataCaptureView,
    FrameSourceState,
    RectangularViewfinder,
    RectangularViewfinderLineStyle,
    RectangularViewfinderStyle,
    VideoResolution
} from 'scandit-react-native-datacapture-core';

import { requestCameraPermissionsIfNeeded } from './camera-permission-handler';

const App = () => {

    const licenseKey = 'Aa8BGhKMM7UTBgMo+S+Czv0KrWueI64Xp2XLX+UpNoLbZaEIWxtwfKBRkWe2RFmTuU8vt08Yi41qZrTknAsOJXZd5T5zdTSgaz/UfAZW86/FVM9PoUqIMYN0Noi1Sk+/hlZhw4Ew4Pn/cGIzlkfPZhZJQt2DbobKDlkmXJhYi5jBTLL5KSI6Uq9BTX69fJ90EGJnh8dpiOrfQs5160r3by9LQuQKQr6dkUrGcLEi4z6fYOP5fXsJe19gn8HmbpP5wEAOPapK3xl9eOFA7WWvl9RlI+s0KjviC2xkz0xAq4+jTFlDsSzsp2xssrGzUfOHUFiC2pJR4CPwVhzw8HeNUYh07quiYLma6FoAQ5BvN0udbP1On2cxSYl9uKNeW5XVaEXCSuhAtEUpRrSUbE54rYUr0rcBWEi/rVjLppho++wZW+yv1kIc3W9f22v/UjIzjFGa3JB5q/lxGuhAA1o1D+ViCRYaVpdEd2wTcL1iF8hbYIau0UdVgTYSNg27Lp4OdhrmOvsK21YtEJwW2xfrFjesUW8CLFxpfRUoADefvMBRM+Q81lD9GfAbX3Uqreb77XF3SdcMoPxpLhVw8fJzh96Cl0pzBYaRoaMs1kggqEhFd9vq+zCE2eLtOT6tw/xqyLtcFAgyC93UOvjhtf9Lcbq3W0oheC0GgUOyO6UCyDwvQPN0j+GaKxRyplD2oblpdq5DiWqyyARzEburivn7ZN4+KcfT5RyvLlJiUzpfJvPFgcgycll1Wg1kmPUp8F23Ik2nvxxSgBvrJ1T0KbsmlCk92ganPda6EPgZD6V6CWXDOi9MfozjhjzpJpiYG0aaF1W6j/YCXAwUcf1jyKqHaFPoMS4iQ8bakYCYfx0OBMpwfZFrpIrWdIjALPcWaMneoYgtCnVRKb7CvnALS5gdwc+QAz+EqHIP3Imz6WW445HyWCOyX/LdQDEjmt+3fIR8Z8NhQhnbFkan1y9WP4tOSBK/cx5SEwSAXy/MBuSid9ct13Gghu2Q7/5mZrUZQ4QSJjXbo0LPqAFNIxAXIqfpTguieorg941bUetMy1rRIa7dtRO9bRcXowkji2kl5D69VMTgDoQhF2xjb6BpI38EHz1NyhRGKTl/lCSENyM/DSp1GFgW+JV92FfCRO7PnUBGRVBKmeiEE4c6PCoAoKoHhU2TygOO8bY5Qj5f2yon7RRJcRqrPOTZc+uiCuPdHXzv';
    const context = DataCaptureContext.forLicenseKey(licenseKey);
    const viewRef = useRef(null);
    const camera = Camera.default;

    // Setup Scanning function
    const setupScanning = () => {

        const settings = new BarcodeCaptureSettings();
        settings.enableSymbologies([
            Symbology.EAN13UPCA,
            Symbology.EAN8,
            Symbology.UPCE,
            Symbology.QR,
            Symbology.DataMatrix,
            Symbology.Code39,
            Symbology.Code128,
            Symbology.InterleavedTwoOfFive,
        ])
        const symbologySettings = settings.settingsForSymbology(Symbology.Code39);
        symbologySettings.activeSymbolCounts = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

        const barcodeCaptureMode = BarcodeCapture.forContext(context, settings);
        const barcodeCaptureListener = {
            didScan: (_, session) => {
                const barcode = session.newlyRecognizedBarcodes[0];
                const symbology = new SymbologyDescription(barcode.symbology);
                barcodeCaptureMode.isEnabled = false;
                Alert.alert(
                    null,
                    `Scanned: ${barcode.data} (${symbology.readableName})`,
                    [{text: 'OK', onPress: () => barcodeCaptureMode.isEnabled = true}],
                    { cancelable: false}
                );
            }
        };

        barcodeCaptureMode.addListener(barcodeCaptureListener);
        const overlay = BarcodeCaptureOverlay.withBarcodeCaptureForViewWithStyle(
            barcodeCaptureMode, viewRef.current, BarcodeCaptureOverlayStyle.Frame
        );
        overlay.viewfinder = new RectangularViewfinder(
            RectangularViewfinderStyle.Square,
            RectangularViewfinderLineStyle.Light
        );
       console.log(overlay)

    }

    const startCamera = () => {
        context.setFrameSource(camera);
        const cameraSettings = new CameraSettings();
        cameraSettings.preferredResolution = VideoResolution.FullHD;
        camera.applySettings(cameraSettings);
        requestCameraPermissionsIfNeeded()
            .then (() => camera.switchToDesiredState(FrameSourceState.On))
            .catch (() => BackHandler.exitApp());
        
    }

    const stopCamera = () => {
        if (camera) {
            camera.switchToDesiredState(FrameSourceState.Off);
        }
    }

    const startCapture = () => {
        startCamera();
        barcodeCaptureMode.isEnabled = true;
    }

    const stopCapture = () => {
        barcodeCaptureMode.isEnabled = false;
        stopCamera();
    }

    const handleAppStateChange = async (nextAppState) => {
        if (nextAppState.match(/inactive|background/)) {
            stopCapture();
        } else {
            startCapture();
        }
    }

    useEffect(() => {
        AppState.addEventListener('change', handleAppStateChange);
        setupScanning()

        return function cleanup() {
            AppState.removeEventListener('change', handleAppStateChange);
            context.dispose();
        }

    }, [])





    return (
        < DataCaptureView style = {{flex: 1}} context = {context} ref = {viewRef} />
    )
}

export default App;
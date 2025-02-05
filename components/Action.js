import React, { useState } from "react";
import { TouchableOpacity, Text } from "react-native";
import { printAsync } from "expo-print";
import * as FileSystem from 'expo-file-system';
import { Asset } from "expo-asset";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useHttp from "../hooks/useHttp";
const Action = ({ name }) => {
  const [pdfUrl, setPdfUrl] = useState(null);
  const { getRequest, patchRequest, deleteRequest } = useHttp();
  const handleShare = async () => {
    try {
      // If the PDF URL is not yet fetched, fetch it
      const token = await AsyncStorage.getItem("token");
      const response = await getRequest("/exam/getcertificate", token);
      console.log(response)
      const certUrl = encodeURI(`${response.certificate}`);
      // const certUrl = `${response.certificate}`;

  
      // Download the certificate
      const certAsset = Asset.fromURI(certUrl);
      await certAsset.downloadAsync();
  
      // Print the certificate
      await printAsync({ uri: certAsset.localUri });
      // await printAsync({
      //   uri: certAsset.localUri ,
      //     orientation: "portrait", // Ensures vertical printing
      //     html: "", // Prevents any fallback rendering issues
      //   });
  
      console.log(certUrl); // Logging the certificate URL for debugging
  
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <TouchableOpacity
      onPress={handleShare}
      color="blue"
      style={{
        padding: '5%',
        backgroundColor: 'blue',
        borderRadius: 50
      }}
    >
      <Text style={{color: 'white', fontWeight: 500}}>Download Certificate</Text>
    </TouchableOpacity>
  );
};

export default Action;

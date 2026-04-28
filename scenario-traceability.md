# Scenario Traceability Matrix

Generated from `API Test Scenario Unimicron` and the Postman collection.

| Test ID | Category | Group | Automation Status | Endpoint / Runner | Postman Items / Notes |
|---|---|---|---|---|---|
| CE-I-01 | Integration | Cross Endpoint Consistency | Automated in Postman/Newman | GetDataMeterSum, GetDataMultimeter | CE-I-01a - Store MeterSum actual Month data for CE-I-01<br>CE-I-01b - Compare Multimeter actual data with MeterSum for CE-I-01 |
| CE-I-02 | Integration | Cross Endpoint Consistency | Automated in Postman/Newman | GetDataMultimeter, GetDataMeterDetail | CE-I-02a - Store Multimeter actual Month data for CE-I-02<br>CE-I-02b - Compare MeterDetail summed data with Multimeter for CE-I-02 |
| CE-I-03 | Integration | Cross Endpoint Consistency | Automated in Postman/Newman | GetDataMeterSum | CE-I-03a - Store MeterSum Past 0 data for CE-I-03<br>CE-I-03b - Compare MeterSum Past 1 data differs for CE-I-03 |
| DB-I-01 | Integration | HTTP API SQL Server | DB helper required | - | Compare MeterSum Actual with SQL query result. |
| DB-I-02 | Integration | HTTP API SQL Server | DB helper required | - | Compare MeterSum Target with SQL query result. |
| DB-I-03 | Integration | HTTP API SQL Server | DB helper required | - | Compare MeterDetail labels with SQL meter names. |
| ERR-I-01 | Integration | System Failure Handling | Manual ops step | - | Stop SQL Server before request. |
| ERR-I-02 | Integration | System Failure Handling | Manual ops step | - | Stop WebSocket server before client connect. |
| ERR-I-03 | Integration | System Failure Handling | Manual ops step | - | Simulate high DB load. |
| HTTP-L-01 | Load | REST API Load | Runner profile | GetDataMeterSum | HTTP-L-01 - Load profile request for GetDataMeterSum Month |
| HTTP-L-02 | Load | REST API Load | Runner profile | GetDataMultimeter | HTTP-L-02 - Load profile request for GetDataMultimeter Month |
| HTTP-L-03 | Load | REST API Load | Runner profile | GetDataMeterDetail | HTTP-L-03 - Load profile request for GetDataMeterDetail Month |
| HTTP-L-04 | Load | REST API Load | Runner profile | GetDataMeterSum, GetDataMultimeter, GetDataMeterDetail | HTTP-L-04a - Mixed load MeterSum request<br>HTTP-L-04b - Mixed load Multimeter request<br>HTTP-L-04c - Mixed load MeterDetail request |
| HTTP-L-05 | Load | REST API Load | Runner profile | GetDataMeterSum | HTTP-L-05 - Sustained load MeterSum request |
| MD-F-01 | Functional | Functional - MeterDetail | Automated in Postman/Newman | GetDataMeterDetail | MD-F-01 - Day detail chart |
| MD-F-02 | Functional | Functional - MeterDetail | Automated in Postman/Newman | GetDataMeterDetail | MD-F-02 - Week detail chart |
| MD-F-03 | Functional | Functional - MeterDetail | Automated in Postman/Newman | GetDataMeterDetail | MD-F-03 - Month detail chart |
| MD-F-04 | Functional | Functional - MeterDetail | Automated in Postman/Newman | GetDataMeterDetail | MD-F-04 - Year detail chart |
| MD-F-05 | Functional | Functional - MeterDetail | Automated in Postman/Newman | GetDataMeterDetail | MD-F-05 - Max10Year detail chart |
| MM-F-01 | Functional | Functional - Multimeter | Automated in Postman/Newman | GetDataMultimeter | MM-F-01 - Day data for multiple meters |
| MM-F-02 | Functional | Functional - Multimeter | Automated in Postman/Newman | GetDataMultimeter | MM-F-02 - Week data for multiple meters |
| MM-F-03 | Functional | Functional - Multimeter | Automated in Postman/Newman | GetDataMultimeter | MM-F-03 - Month data for multiple meters |
| MM-F-04 | Functional | Functional - Multimeter | Automated in Postman/Newman | GetDataMultimeter | MM-F-04 - Year data for multiple meters |
| MM-F-05 | Functional | Functional - Multimeter | Automated in Postman/Newman | GetDataMultimeter | MM-F-05 - Max10Year data for multiple meters |
| MS-F-01 | Functional | Functional - MeterSum | Automated in Postman/Newman | GetDataMeterSum | MS-F-01 - Day comparison by selected days |
| MS-F-02 | Functional | Functional - MeterSum | Automated in Postman/Newman | GetDataMeterSum | MS-F-02 - Week comparison by selected week ranges |
| MS-F-03 | Functional | Functional - MeterSum | Automated in Postman/Newman | GetDataMeterSum | MS-F-03 - Month comparison by selected months |
| MS-F-04 | Functional | Functional - MeterSum | Automated in Postman/Newman | GetDataMeterSum | MS-F-04 - Year comparison by selected years |
| MS-F-05 | Functional | Functional - MeterSum | Automated in Postman/Newman | GetDataMeterSum | MS-F-05 - Max10Year comparison across ten years |
| RF-01 | Functional | Response Integrity | Automated in Postman/Newman | GetDataMeterSum | RF-01 - MeterSum Day keys are time/data-select strings |
| RF-02 | Functional | Response Integrity | Automated in Postman/Newman | GetDataMultimeter | RF-02 - Multimeter Day keys are meter IDs |
| RF-03 | Functional | Response Integrity | Automated in Postman/Newman | GetDataMeterSum | RF-03 - MeterSum max values cover Month data |
| RF-04 | Functional | Response Integrity | Automated in Postman/Newman | GetDataMultimeter | RF-04 - Multimeter max values cover Month data |
| RF-05 | Functional | Response Integrity | Automated in Postman/Newman | GetDataMeterDetail | RF-05 - MeterDetail chart series object structure |
| RF-06 | Functional | Response Integrity | Automated in Postman/Newman | GetDataMeterDetail | RF-06 - MeterDetail MeterLabelMap selected IDs |
| RF-07 | Functional | Response Integrity | Automated in Postman/Newman | GetDataMeterDetail | RF-07 - MeterDetail stroke length consistency |
| RF-08 | Functional | Response Integrity | Automated in Postman/Newman | GetDataMeterSum | RF-08a - MeterSum Day categories for 5 minute interval<br>RF-08b - MeterSum Day categories for 15 minute interval<br>RF-08c - MeterSum Day categories for 60 minute interval |
| VF-01 | Validation | Validation - Invalid Format | Automated in Postman/Newman | GetDataMeterSum | VF-01 - MeterSum malformed week DataSelect |
| VF-02 | Validation | Validation - Invalid Format | Automated in Postman/Newman | GetDataMultimeter | VF-02 - Multimeter malformed Max10Year DataSelect |
| VF-03 | Validation | Validation - Invalid Format | Automated in Postman/Newman | GetDataMeterDetail | VF-03 - MeterDetail month without leading zero |
| VM-01 | Validation | Validation - Invalid Meter ID | Automated in Postman/Newman | GetDataMeterSum | VM-01 - MeterSum invalid meter ID |
| VM-02 | Validation | Validation - Invalid Meter ID | Automated in Postman/Newman | GetDataMultimeter | VM-02 - Multimeter mixed valid and invalid meter IDs |
| VO-01 | Validation | Validation - Out Of Range | Automated in Postman/Newman | GetDataMeterSum | VO-01 - MeterSum negative Past |
| VO-02 | Validation | Validation - Out Of Range | Automated in Postman/Newman | GetDataMeterSum | VO-02 - MeterSum unsupported Day interval |
| VO-03 | Validation | Validation - Out Of Range | Automated in Postman/Newman | GetDataMeterSum | VO-03 - MeterSum invalid Month 13 |
| VO-04 | Validation | Validation - Out Of Range | Automated in Postman/Newman | GetDataMeterDetail | VO-04 - MeterDetail unreasonably large past |
| VR-01 | Validation | Validation - Required Fields | Automated in Postman/Newman | GetDataMeterSum | VR-01 - MeterSum missing Type |
| VR-02 | Validation | Validation - Required Fields | Automated in Postman/Newman | GetDataMeterSum | VR-02 - MeterSum missing Meter |
| VR-03 | Validation | Validation - Required Fields | Automated in Postman/Newman | GetDataMeterSum | VR-03 - MeterSum missing DataSelect |
| VR-04 | Validation | Validation - Required Fields | Automated in Postman/Newman | GetDataMultimeter | VR-04 - Multimeter missing Interval |
| VR-05 | Validation | Validation - Required Fields | Automated in Postman/Newman | GetDataMeterDetail | VR-05 - MeterDetail missing past |
| VT-01 | Validation | Validation - Wrong Data Type | Automated in Postman/Newman | GetDataMeterSum | VT-01 - MeterSum Interval as string |
| VT-02 | Validation | Validation - Wrong Data Type | Automated in Postman/Newman | GetDataMultimeter | VT-02 - Multimeter Meter as scalar |
| VT-03 | Validation | Validation - Wrong Data Type | Automated in Postman/Newman | GetDataMeterSum | VT-03 - MeterSum DataSelect as string |
| VT-04 | Validation | Validation - Wrong Data Type | Automated in Postman/Newman | GetDataMeterDetail | VT-04 - MeterDetail past as string |
| WS-F-01 | Functional | WebSocket Happy Path | WebSocket helper required | - | Send PING and validate PONG fields. |
| WS-F-02 | Functional | WebSocket Happy Path | WebSocket helper required | - | Validate case-insensitive Cmd/ping. |
| WS-F-03 | Functional | WebSocket Happy Path | WebSocket helper required | - | Validate alternative command field name. |
| WS-F-04 | Functional | WebSocket Happy Path | WebSocket helper required | - | Validate INFO root fields. |
| WS-F-05 | Functional | WebSocket Happy Path | WebSocket helper required | - | Validate INFO Sensors array filters. |
| WS-F-06 | Functional | WebSocket Happy Path | WebSocket helper required | - | Validate INFO count arithmetic. |
| WS-F-07 | Functional | WebSocket Happy Path | WebSocket helper required | - | Validate INFO sensor object fields. |
| WS-I-01 | Integration | WebSocket Sensor/PLC | Manual with PLC reference | - | Compare INFO Value with direct PLC reading. |
| WS-I-02 | Integration | WebSocket Sensor/PLC | Manual with PLC reference | - | Verify LastUpdated age for online sensors. |
| WS-I-03 | Integration | WebSocket Sensor/PLC | Manual with PLC reference | - | Compare Online count with PLC count. |
| WS-L-01 | Load | WebSocket Load | Load helper required | - | 10 concurrent WS PING clients. |
| WS-L-02 | Load | WebSocket Load | Load helper required | - | 50 concurrent WS PING clients. |
| WS-L-03 | Load | WebSocket Load | Load helper required | - | 100 concurrent WS PING clients. |
| WS-L-04 | Load | WebSocket Load | Load helper required | - | Single client sends 100 PING frames. |
| WS-L-05 | Load | WebSocket Load | Load helper required | - | Single client sends 50 INFO frames. |

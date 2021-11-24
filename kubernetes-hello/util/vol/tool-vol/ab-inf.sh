# warm up
outputFile=/tool/log/ab-result-$(date +"%Y.%m.%d-%H.%M.%S")-$RANDOM.log
echo "AB at time=$(date +"%Y.%m.%d-%H.%M.%S") saved at: ${outputFile}" \
  | tee -a $outputFile
echo "" | tee -a $outputFile
sleep 2
if [ "$POST_FILE" == "" ] ; then
  if [ "$TOKEN" == "" ] ; then
    ab -v2 \
      "${AB_URL}" | grep "Document Path" -B 9999 | tee -a $outputFile
  else
    ab -v2 \
      -H "Authorization: Bearer ${TOKEN}" \
      "${AB_URL}" | grep "Document Path" -B 9999 | tee -a $outputFile
  fi
else
  if [ "$TOKEN" == "" ] ; then
    ab -v2 \
      -p "${POST_FILE}" -m ${HTTP_METHOD} \
      -T "application/json" \
      "${AB_URL}" \
    | grep "Document Path" -B 9999 | tee -a $outputFile
  else
    ab -v2 \
      -H "Authorization: Bearer ${TOKEN}" \
      -p "${POST_FILE}" -m ${HTTP_METHOD} \
      -T "application/json" \
      "${AB_URL}" \
    | grep "Document Path" -B 9999 | tee -a $outputFile
  fi
fi
sleep ${INIT_WAIT_SEC}

while [ $(date +%S) -ne "00" ]
do

  echo "================================================================" | tee -a $outputFile
  echo "================================================================" | tee -a $outputFile
  echo "====        ab-inf script v1004" | tee -a $outputFile
  echo "================================================================" | tee -a $outputFile
  echo "================================================================" | tee -a $outputFile

  # follows environment variables.
  if [ "$POST_FILE" == "" ] ; then
    if [ "$TOKEN" == "" ] ; then
      ab -v${AB_V} \
        -c ${AB_CC} -n ${AB_N} \
        "${AB_URL}" \
      | tee -a $outputFile
    else
      ab -v${AB_V} \
        -H "Authorization: Bearer ${TOKEN}" \
        -c ${AB_CC} -n ${AB_N} \
        "${AB_URL}" \
      | tee -a $outputFile
    fi
  else
    if [ "$TOKEN" == "" ] ; then
      ab -v${AB_V} \
        -c ${AB_CC} -n ${AB_N} \
        -p "${POST_FILE}" -m ${HTTP_METHOD} \
        -T "application/json" \
        "${AB_URL}" \
      | tee -a $outputFile
    else
      ab -v${AB_V} \
        -H "Authorization: Bearer ${TOKEN}" \
        -c ${AB_CC} -n ${AB_N} \
        -p "${POST_FILE}" -m ${HTTP_METHOD} \
        -T "application/json" \
        "${AB_URL}" \
      | tee -a $outputFile
    fi
  fi

  echo "================================================================" | tee -a $outputFile
  echo "====        DONE" | tee -a $outputFile
  echo "================================================================" | tee -a $outputFile

  echo $(date +"%Y.%m.%d-%H.%M.%S")
  # sleep 0.2
done

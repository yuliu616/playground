# usage: innodb-stat.sh [options] {POD_NAME}
#   examples:
#       innodb-stat.sh people-db-plan-597c4bbb8f-xj2qt
#       innodb-stat.sh -f people-db-plan-597c4bbb8f-xj2qt

if [ "$1" == "-f" ] ; then
  POD_NAME=$2
  INF_LOOP="1"
elif [ "$2" == "-f" ] ; then
  POD_NAME=$1
  INF_LOOP="1"
else
  POD_NAME=$1
  INF_LOOP="0"
fi

if [ "$POD_NAME" == "" ] ; then
  echo "usage: innodb-stat.sh [options] {POD_NAME}"
  echo "  -f : infinity loop"
  exit 1
fi

# version: by insert/s
# statline="$(kubectl exec $POD_NAME -- \
#   mysql -uroot -ppass1234 -e "SHOW ENGINE INNODB STATUS;" 2>&1 \
#   | sed -e 's/\\n/\n/g' \
#   | grep -A1 'Number of rows inserted' \
#   | grep 'inserts/s' \
#   | sed -e 's/,/,    /g' )"
# version: by inserted (accumlated)
# statline="$(kubectl exec $POD_NAME -- \
#   mysql -uroot -ppass1234 -e "SHOW ENGINE INNODB STATUS;" 2>&1 \
#   | sed -e 's/\\n/\n/g' \
#   | grep 'Number of rows inserted' \
#   | sed -e 's/,/    /g' )"

if [ "$INF_LOOP" == "1" ] ; then

  while [ 1 -eq 1 ]
  do {
    time=$(date +"%Y.%m.%d-%H.%M.%S")
    statline="$(kubectl exec $POD_NAME -- \
      mysql -uroot -ppass1234 -e "SHOW ENGINE INNODB STATUS;" 2>&1 \
      | sed -e 's/\\n/\n/g' \
      | grep 'Number of rows inserted' \
      | sed -e 's/,/    /g' )"
    connStat="$(kubectl exec $POD_NAME -- \
       mysql -uroot -ppass1234 -e "SHOW GLOBAL STATUS LIKE 'Max_used_connections';" 2>&1 \
       | tail -1)"
    podTop="$(kubectl top pod 2>&1 | grep $POD_NAME)"
    echo "$time:    $connStat    $statline    $podTop" | tee -a log/innodb-stat.log
    sleep 1
  } done

else

  time=$(date +"%Y.%m.%d-%H.%M.%S")
  statline="$(kubectl exec $POD_NAME -- \
    mysql -uroot -ppass1234 -e "SHOW ENGINE INNODB STATUS;" 2>&1 \
    | sed -e 's/\\n/\n/g' \
    | grep 'Number of rows inserted' \
    | sed -e 's/,/    /g' )"
  connStat="$(kubectl exec $POD_NAME -- \
     mysql -uroot -ppass1234 -e "SHOW GLOBAL STATUS LIKE 'Max_used_connections';" 2>&1 \
     | tail -1)"
  podTop="$(kubectl top pod 2>&1 | grep $POD_NAME)"
  echo "$time:    $connStat    $statline    $podTop" | tee -a log/innodb-stat.log

fi

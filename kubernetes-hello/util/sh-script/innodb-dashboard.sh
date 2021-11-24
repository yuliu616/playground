# usage: innodb-dashboard.sh {SECTION} {POD_NAME}
#   examples:
#       innodb-stat.sh people-db-plan-597c4bbb8f-xj2qt
#       innodb-stat.sh -f people-db-plan-597c4bbb8f-xj2qt
#       innodb-stat.sh -d people-db-plan-597c4bbb8f-xj2qt

SECTION=$1
POD_NAME=$2

if [ "$SECTION" == "" ] || [ "$POD_NAME" == "" ] ; then
  echo "usage: innodb-dashboard.sh {SECTION} {POD_NAME}"
  echo "  SECTION could be :"
  echo "    - ALL"
  echo "    - BACKGROUND THREAD"
  echo "    - SEMAPHORES"
  echo "    - TRANSACTIONS"
  echo "    - FILE I/O"
  echo "    - INSERT BUFFER AND ADAPTIVE HASH INDEX"
  echo "    - LOG"
  echo "    - BUFFER POOL AND MEMORY"
  echo "    - ROW OPERATIONS"
  exit 1
fi

while [ 1 -eq 1 ]
do
  if [ "$SECTION" == "*" ] || [ "$SECTION" == "ALL" ] ; then
    kubectl exec $POD_NAME -- \
      mysql -uroot -ppass1234 -e "SHOW ENGINE INNODB STATUS;" 2>&1 \
      | sed -e 's/\\n/\n/g'
  else
    kubectl exec $POD_NAME -- \
      mysql -uroot -ppass1234 -e "SHOW ENGINE INNODB STATUS;" 2>&1 \
      | sed -e 's/\\n/\n/g' \
      | grep -A100 "${SECTION}" \
      | grep -m 2 -B100 -e '---'
  fi
  sleep 0.1
done

#!/bin/bash
if [ -z "$1" ]; then
  echo 1>&2 "Argument 1 should be the home url"
  exit 1
fi

if [ -z "$2" ]; then
  echo 1>&2 "Argument 2 should be the path to the neontabs folder"
  exit 1
fi


# MOOTOOLS="--mootools=`locate -l 1 neontabs_casper/resources/mootools.js`"
# LEVEN="--leven=`locate -l 1 neontabs_casper/resources/String.levenshtein.js`"
REPORTING="--reportfails --screencapfails"
# INCLUDES="--includes=`locate -l 1 neontabs_casper/resources/casper_util.js`"

if [ ! -z "$JENKINS_URL" ]; then
  NOCOLORS="--no-colors"
fi

# Assuming we're running this from the neontabs folder
# casperjs test $NOCOLORS --xunit=casper-out.landing_page.xml $NOCOLORS --target="$1" neontabs_casper/tests/landing_page.js
# status="$?"

# count js files
cd $2;

count=`ls -1 *.js 2>/dev/null | wc -l`;


#if no js files found exit
if [ $count = 0 ]; then
	echo 1>&2 "Directory doesn't contain js files.";
	exit 1
fi

for file in "$2"*.js
do
	casperjs test $NOCOLORS --xunit=casper-out."$file" $NOCOLORS --target="$1" "$file"
	status=$(($status+$?))
done

# casperjs test $NOCOLORS --xunit=casper-out.quick_search_form.xml $NOCOLORS --target="$1" neontabs_casper/tests/quick_search_form.js
# status=$(($status+$?))

if [ "$status" != 0 ]; then
	echo "TEST FAILED"
	exit $status
fi

cd -
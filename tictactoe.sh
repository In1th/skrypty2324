#!/bin/bash

SYMBOL="O"
STATE=("" " " " " " " " " " " " " " " " " " " " ")
LOCAL=true
CHOICE_RE='^[1-9]$'
PLAYED_LAST="0"

SAVEFILE="./save.txt"

topMsg() {
    if [[ $LOCAL == true ]]; then
        local val="$SYMBOL's turn"
    else
        [[ $PLAYED_LAST != "0" ]] && local val="Computer chose $PLAYED_LAST"
    fi
    echo $val
}

board() {
    echo
    echo " ${STATE[1]} | ${STATE[2]} | ${STATE[3]}  | $(topMsg)"
    echo "---+---+--- | ------------------"
    echo " ${STATE[4]} | ${STATE[5]} | ${STATE[6]}  | Place symbol [1-9]"
    echo "---+---+--- | Save           [S]"
    echo " ${STATE[7]} | ${STATE[8]} | ${STATE[9]}  | Exit      [Ctrl+C]"
    echo
}

user() {
    printf ": "
    read CHOICE
    if [[ $CHOICE == "S" ]]; then
        save
        user
        return
    fi
    if ! [[ $CHOICE =~ $CHOICE_RE ]]; then
        echo "Please enter correct input"
        user
        return
    fi
    if [[ ${STATE[$CHOICE]} != " " ]]; then
        echo "This field is occupied"
        user
        return
    fi
    STATE[$CHOICE]=$SYMBOL
}

computer() {
    CHOICE=$(($RANDOM % 9 + 1))
    if [[ ${STATE[$CHOICE]} != " " ]]; then
        computer
        return
    fi
    STATE[$CHOICE]=$SYMBOL
    PLAYED_LAST=$CHOICE
}

check_win_conditions() {
    # horizontally
    for i in 1 4 7; do
        j=$(($i + 1))
        k=$(($i + 2))
        WINNER=${STATE[$i]}
        if [[ ${STATE[$i]} == ${STATE[$j]} ]] && [[ ${STATE[$j]} == ${STATE[$k]} ]]; then
            [[ $WINNER != " " ]] && declare_winner $WINNER
            return
        fi
    done
    
    # vertically
    for i in 1 2 3; do
        j=$(($i + 3))
        k=$(($i + 6))
        WINNER=${STATE[$i]}
        if [[ ${STATE[$i]} == ${STATE[$j]} ]] && [[ ${STATE[$j]} == ${STATE[$k]} ]]; then
            [[ $WINNER != " " ]] && declare_winner $WINNER
            return
        fi
    done

    # diagonally
    WINNER=${STATE[5]}

    if [[ ${STATE[1]} == ${STATE[5]} ]] && [[ ${STATE[5]} == ${STATE[9]} ]]; then
        [[ $WINNER != " " ]] && declare_winner $WINNER
    fi

    if [[ ${STATE[3]} == ${STATE[5]} ]] && [[ ${STATE[5]} == ${STATE[7]} ]]; then
        [[ $WINNER != " " ]] && declare_winner $WINNER
    fi
}

check_full(){
    for i in {1..9}
    do
        if [[ ${STATE[$i]} == " " ]]; then
            return
        fi
    done
    
    board
    echo "Draw!"
    exit 0
}

declare_winner(){
    if [[ $1 != $SYMBOL ]]; then
        echo "Winning symbol doesn't match current symbol!"
        exit 1
    fi
    board
    echo "$1 won!"
    exit 0
}

has_argument() {
    [[ ("$1" == *=* && -n ${1#*=}) || ( ! -z "$2" && "$2" != -*)  ]];
}

extract_argument() {
  echo "${2:-${1#*=}}"
}

handle_options() {
    while [ $# -gt 0 ]; do
    case $1 in
        -h | --help)
        help
        exit 0
        ;;
        -l | --load*) 
        if ! has_argument $@; then
          echo "File not specified." >&2
          exit 1
        fi
        local filename=$(extract_argument $@)
        load_save $filename $(cat $filename)
        shift
        shift
        ;;
        -c | --computer)
        echo "Playing aganist computer"
        LOCAL=false
        shift
        ;;
        *)
        echo "Invalid argument: $1, plase use -h or --help for help"
        exit 1
        ;;
        esac
    done
}

help() {
    echo "Commands avaliable:"
    echo "  -h, --help:     displays all avaliable commands, doesn't start the game"
    echo "  -l, --load:     loads saved game status from FILE"
    echo "  -c, --computer: starts a game aganist a computer"
}

load_save() {
    echo "Loading saved data from $1"
    [[ $(expr substr $2 1 1) == "1" ]] && local loaded_local=true || local loaded_local=false
    if [[ $LOCAL == false ]] && [[ $loaded_local == true ]]; then
        echo "Error! Trying to make a co-op game into a computer game"
        exit 1
    fi
    
    LOCAL=$loaded_local
    SYMBOL=$(expr substr $2 2 1)

    for i in {3..11}
    do
        local state_idx=$(( $i - 2 ))
        local chr=$(expr substr $2 $i 1)
        [[ $chr == "_" ]] && chr=" "
        STATE[$state_idx]=$chr
        # echo ${STATE[$state_idx]}
    done
    # echo $SYMBOL
    # echo $LOCAL
    echo "Loading complete!"
}

save() {
    [[ $LOCAL == true ]] && local acc="1" || local acc="0"
    acc="$acc$SYMBOL"
    for i in {1..9}
    do
        [[ ${STATE[$i]} == " " ]] && chr=_ || chr=${STATE[$i]}
        acc="$acc$chr"
    done
    echo $acc > $SAVEFILE
    echo "Saved the game to "$SAVEFILE""
}

handle_options "$@"

while [[ true ]]; do
    
    if [[ $SYMBOL == "X" ]] && ! [[ $LOCAL == true ]]; then
        computer
    else
        board
        user
    fi

    check_win_conditions
    check_full

    if [[ $SYMBOL == "X" ]]; then
        SYMBOL="O"
    else
        SYMBOL="X"
    fi
done
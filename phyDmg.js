/*
File name: phyDmg.js

Description:
Calculate the physical damage based on the reference below
http://yodaru.webcrow.jp/FFRK/damage.php
Ignore standing front/back and the ramdom factor

Copyright 2017-present by Tingyeu Yang
*/

var refCalc = document.getElementById("calc");
var refOutputRate = document.getElementById("outputRate");
var refOutputAmount = document.getElementById("outputAmount");
var refOutputSakebu = document.getElementById("outputSakebu");

var atk, def, weakPoint, weaker, weak, elementBuff1, elementBuff2, diveElementUpPercent, cri1, cri2, cri3,
rmBuff1, rmBuff2, rmBuff3, rmWeakUp, diveWeakUpPercent,
equipUp1, equipUp2, equipUp3, diveEquipUpPercent,
abilityUp1, abilityUp2, abilityUp3, diveAbilityUpPercent;

var power = 100;    // 100 for "Attack"
var basic1 = 0;
var basic2 = 0;
var total = 0;


function initallize(){
	
    if ( $("#id_ATK").val() == "" ){ atk = 1; } else { atk = $("#id_ATK").val(); }
    if ( $("#id_DEF").val() == "" ){ def = 1; } else { def = $("#id_DEF").val(); }
    
    weakPoint = parseFloat($("#id_weakPoint").val());
    weaker = parseFloat($("#id_weaker").val());
    rmWeakUp = parseFloat($("#id_rm_weakUp").val());    

    if ( !$("#id_element1").is(":checked") ){ elementBuff1 = 0; } else { elementBuff1 = parseFloat($("#id_element1").val()); }
    if ( !$("#id_element2").is(":checked") ){ elementBuff2 = 0; } else { elementBuff1 = parseFloat($("#id_element2").val()); }
    
    if ( !$("#id_RM1").is(":checked") ){ rmBuff1 = 0; } else { rmBuff1 = parseFloat($("#id_RM1").val()); }
    if ( !$("#id_RM2").is(":checked") ){ rmBuff2 = 0; } else { rmBuff2 = parseFloat($("#id_RM2").val()); }
    if ( !$("#id_RM3").is(":checked") ){ rmBuff3 = 0; } else { rmBuff3 = parseFloat($("#id_RM3").val()); }
    
    if ( !$("#id_equip1").is(":checked") ){ equipUp1 = 0; } else { equipUp1 = parseFloat($("#id_equip1").val()); }
    if ( !$("#id_equip2").is(":checked") ){ equipUp2 = 0; } else { equipUp2 = parseFloat($("#id_equip2").val()); }
    if ( !$("#id_equip3").is(":checked") ){ equipUp3 = 0; } else { equipUp3 = parseFloat($("#id_equip3").val()); }

    if ( !$("#id_ability1").is(":checked") ){ abilityUp1 = 0; } else { abilityUp1 = parseFloat($("#id_ability1").val()); }
    if ( !$("#id_ability2").is(":checked") ){ abilityUp2 = 0; } else { abilityUp2 = parseFloat($("#id_ability2").val()); }
    if ( !$("#id_ability3").is(":checked") ){ abilityUp3 = 0; } else { abilityUp3 = parseFloat($("#id_ability3").val()); }
    
    if ( !$("#id_cri1").is(":checked") ){ cri1 = 0; } else { cri1 = parseFloat($("#id_cri1").val()); }
    if ( !$("#id_cri2").is(":checked") ){ cri2 = 0; } else { cri2 = parseFloat($("#id_cri2").val()); }
    if ( !$("#id_cri3").is(":checked") ){ cri3 = 0; } else { cri3 = parseFloat($("#id_cri3").val()); }
    
    if ( $("#id_dive_elementUpPercent").val() == "" ){ diveElementUpPercent = 0; }
    else { diveElementUpPercent = parseFloat($("#id_dive_elementUpPercent").val()); }
    
    if ( $("#id_dive_weakUpPercent").val() == "" ){ diveWeakUpPercent = 0; }
    else { diveWeakUpPercent = parseFloat($("#id_dive_weakUpPercent").val()); }
    
    if ( $("#id_dive_equipUpPercent").val() == "" ){ diveEquipUpPercent = 0; }
    else { diveEquipUpPercent = parseFloat($("#id_dive_equipUpPercent").val()); }
    
    if ( $("#id_dive_abilityUpPercent").val() == "" ){ diveAbilityUpPercent = 0; }
    else { diveAbilityUpPercent = parseFloat($("#id_dive_abilityUpPercent").val()); }    
}


function doCalculate(){
    
    initallize();
    
    // 5 + 攻撃力^1.8 × 防御力^-0.5 × 威力 ÷ 100
    // 5 + 攻撃力^0.5 × 防御力^-0.5 × 威力 × 60
    if(atk <= 805){
        basic1 = Math.floor(5 + Math.pow(atk, 1.8) * Math.pow(def, -0.5) * power / 100);
    }
    else{
        basic1 = Math.floor(5 + Math.pow(atk, 0.5) * Math.pow(def, -0.5) * power * 60);
    }    
            
    /*
       準基本式 = [ [ 基本式 ] × 乱数補正 × 属性補正
                × (1 + 属性強化 + レコダイ属性補正)
                × 隊列補正 × (1 + クリティカル補正) ]
                
                Ignore 乱数補正 and 隊列補正
    */
    
    weak = weakPoint + weaker;
    if(weak > 2){weak = 2;}
    
    basic2 = Math.floor(basic1 * weak
                 * (1 + elementBuff1 + elementBuff2 + diveElementUpPercent / 100)
                 * (1 + cri1 + cri2 + cri3));
    /*
       ダメージ = [ [ [ [ [ 準基本式 ]
                  × (1 + レコマテ属性補正) ]
                  × (1 + レコマテ弱点補正 + レコダイ弱点補正) ]
                  × (1 + レコマテ装備補正 + レコダイ装備補正) ]
                  × (1 + レコマテカテゴリ補正 + レコダイカテゴリ補正) ]    
    */
    total = Math.floor(basic2
              * (1 + rmBuff1 + rmBuff2 + rmBuff3)
              * (1 + rmWeakUp + diveWeakUpPercent / 100)
              * (1 + equipUp1 + equipUp2 + equipUp3 + diveEquipUpPercent / 100)
              * (1 + abilityUp1 +abilityUp2 + abilityUp3 + diveAbilityUpPercent / 100));
              

    refOutputRate.innerHTML = total / basic1;
    refOutputAmount.innerHTML = total;
    refOutputSakebu.innerHTML = Math.floor(total * 1.4);
}

refCalc.onclick = doCalculate;


 

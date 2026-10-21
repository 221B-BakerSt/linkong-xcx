<template>
  <view class="container">
     <!-- 详情 -->
    <view class="info-section">
        <view class="info-title">填报信息</view>
        <up-line></up-line>
        <view class="info-item">
            <view class="info-label">企业名称</view>
            <view class="info-value">{{ corporateInfo.enterpriseName || '-' }}</view>
        </view>
        <view class="info-item">
            <view class="info-label">填报月份</view>
            <view class="info-value">{{ corporateInfo.createTime || '-' }}</view>
        </view>
    </view>
     <!-- 运营情况 -->
    <view class="info-section">
        <view class="info-title">运营情况</view>
        <up-line></up-line>
        <view class="info-item">
            <view class="info-label">项目投资备案证明</view>
            <view class="info-value">{{ corporateInfo.projectInvestmentRecorded || '-' }}</view>
        </view>
        <view class="info-item">
            <view class="info-label">项目投资备案证明预计完成时间</view>
            <view class="info-value">{{ corporateInfo.projectInvestmentRecordedTime || '-' }}</view>
        </view>
        <view class="info-item">
            <view class="info-label">环评手续办理进度</view>
            <view class="info-value">{{ corporateInfo.environmentalAssessmentCompleted || '-' }}</view>
        </view>
        <view class="info-item">
            <view class="info-label">环评手续办理进度预计完成时间</view>
            <view class="info-value">{{ corporateInfo.environmentalAssessmentCompletedTime || '-' }}</view>
        </view>
        <view class="info-item">
            <view class="info-label">消防手续办理进度</view>
            <view class="info-value">{{ corporateInfo.fireApprovalCompleted || '-' }}</view>
        </view>
        <view class="info-item">
            <view class="info-label">消防手续办理进度预计完成时间</view>
            <view class="info-value">{{ corporateInfo.fireApprovalCompletedTime || '-' }}</view>
        </view>
        <view class="info-item">
            <view class="info-label">安评手续办理进度</view>
            <view class="info-value">{{ corporateInfo.safetyAssessmentCompleted || '-' }}</view>
        </view>
        <view class="info-item">
            <view class="info-label">安评手续办理进度预计完成时间</view>
            <view class="info-value">{{ corporateInfo.safetyAssessmentCompletedTime || '-' }}</view>
        </view>
        <view class="info-item">
            <view class="info-label">职评手续办理进度</view>
            <view class="info-value">{{ corporateInfo.occupationalAssessmentCompleted || '-' }}</view>
        </view>
        <view class="info-item">
            <view class="info-label">职评手续办理进度预计完成时间</view>
            <view class="info-value">{{ corporateInfo.occupationalAssessmentCompletedTime || '-' }}</view>
        </view>
        <view class="info-item">
            <view class="info-label">运营进度</view>
            <view class="info-value">{{ corporateInfo.operationStarted || '-' }}</view>
        </view>
        <view class="info-item">
            <view class="info-label">运营进度预计完成时间</view>
            <view class="info-value">{{ corporateInfo.operationStartedTime || '-' }}</view>
        </view>
        <view class="info-item">
            <view class="info-label">企业状态</view>
            <view class="info-value">{{ corporateInfo.enterpriseStatus || '-' }}</view>
        </view>
        <view class="info-item">
            <view class="info-label">生产状态</view>
            <view class="info-value">{{ corporateInfo.productionStatus || '-' }}</view>
        </view>
    </view>
    <!-- 经营情况 -->
    <view class="info-section">
        <view class="info-title">经营情况</view>
        <up-line></up-line>
        <view class="info-item">
            <view class="info-label">本月总投资额</view>
            <view class="info-value">{{ corporateInfo.monthlyTotalInvestment || '-' }}万元</view>
        </view>
        <view class="info-item">
            <view class="info-label">本月设备投资额</view>
            <view class="info-value">{{ corporateInfo.monthlyEquipmentInvestment || '-' }}万元</view>
        </view>
        <view class="info-item">
            <view class="info-label">本月固定资产投资额</view>
            <view class="info-value">{{ corporateInfo.monthlyFixedAssetInvestment || '-' }}万元</view>
        </view>
        <view class="info-item">
            <view class="info-label">本月总投融资额</view>
            <view class="info-value">{{ corporateInfo.monthlyTotalFinancing || '-' }}万元</view>
        </view>
        <view class="info-item">
            <view class="info-label">本月基金</view>
            <view class="info-value">{{ corporateInfo.monthlyFund || '-' }}万元</view>
        </view>
        <view class="info-item">
            <view class="info-label">本月风投</view>
            <view class="info-value">{{ corporateInfo.monthlyVentureCapital || '-' }}万元</view>
        </view>
        <view class="info-item">
            <view class="info-label">本月银行融资</view>
            <view class="info-value">{{ corporateInfo.monthlyBankFinancing || '-' }}万元</view>
        </view>
        <view class="info-item">
            <view class="info-label">本月其他投融资额</view>
            <view class="info-value">{{ corporateInfo.monthlyOtherFinancing || '-' }}万元</view>
        </view>
        <view class="info-item">
            <view class="info-label">本月在孵企业研究与试验发展(R&D)经费支出</view>
            <view class="info-value">{{ corporateInfo.monthlyRAndDExpenditure || '-' }}万元</view>
        </view>
        <view class="info-item">
            <view class="info-label">本月营业收入</view>
            <view class="info-value">{{ corporateInfo.monthlyOperatingIncome || '-' }}万元</view>
        </view>
        <view class="info-item">
            <view class="info-label">本月合同额</view>
            <view class="info-value">{{ corporateInfo.monthlyContractAmount || '-' }}万元</view>
        </view>
        <view class="info-item">
            <view class="info-label">本月毛利润</view>
            <view class="info-value">{{ corporateInfo.monthlyGrossProfit || '-' }}万元</view>
        </view>
        <view class="info-item">
            <view class="info-label">本月净利润</view>
            <view class="info-value">{{ corporateInfo.monthlyNetProfit || '-' }}万元</view>
        </view>
        <view class="info-item">
            <view class="info-label">本月总税收</view>
            <view class="info-value">{{ corporateInfo.monthlyTotalTax || '-' }}万元</view>
        </view>
    </view>
    
    <!-- 人员信息 -->
    <view class="info-section">
        <view class="info-title">人员信息</view>
        <up-line></up-line>
        <view class="info-item">
            <view class="info-label">职工总人数</view>
            <view class="info-value">{{ corporateInfo.totalEmployees || '-' }}人</view>
        </view>
        <view class="info-item">
            <view class="info-label">男职工</view>
            <view class="info-value">{{ corporateInfo.maleEmployees || '-' }}人</view>
        </view>
        <view class="info-item">
            <view class="info-label">女职工</view>
            <view class="info-value">{{ corporateInfo.femaleEmployees || '-' }}人</view>
        </view>
        <view class="info-item">
            <view class="info-label">博士学历职工</view>
            <view class="info-value">{{ corporateInfo.phdEmployees || '-' }}人</view>
        </view>
        <view class="info-item">
            <view class="info-label">硕士学历职工</view>
            <view class="info-value">{{ corporateInfo.masterEmployees || '-' }}人</view>
        </view>
        <view class="info-item">
            <view class="info-label">本科学历职工</view>
            <view class="info-value">{{ corporateInfo.bachelorEmployees || '-' }}人</view>
        </view>
        <view class="info-item">
            <view class="info-label">大专学历职工</view>
            <view class="info-value">{{ corporateInfo.collegeEmployees || '-' }}人</view>
        </view>
        <view class="info-item">
            <view class="info-label">应届毕业生</view>
            <view class="info-value">{{ corporateInfo.freshGraduates || '-' }}人</view>
        </view>
        <view class="info-item">
            <view class="info-label">党员人数</view>
            <view class="info-value">{{ corporateInfo.partyMembers || '-' }}人</view>
        </view>
        <view class="info-item">
            <view class="info-label">28岁以下非党员</view>
            <view class="info-value">{{ corporateInfo.nonPartyMembersUnder28 || '-' }}人</view>
        </view>
        <view class="info-item">
            <view class="info-label">实际在园职工</view>
            <view class="info-value">{{ corporateInfo.actualEmployeesInPark || '-' }}人</view>
        </view>
        <view class="info-item">
            <view class="info-label">实际在园男职工</view>
            <view class="info-value">{{ corporateInfo.actualMaleEmployeesInPark || '-' }}人</view>
        </view>
        <view class="info-item">
            <view class="info-label">实际在园女职工</view>
            <view class="info-value">{{ corporateInfo.actualFemaleEmployeesInPark || '-' }}人</view>
        </view>
        <view class="info-item">
            <view class="info-label">实际在园博士学历职工</view>
            <view class="info-value">{{ corporateInfo.actualPhdEmployeesInPark || '-' }}人</view>
        </view>
    </view>
    
    <!-- 资质认证 -->
    <view class="info-section">
        <view class="info-title">资质认证</view>
        <up-line></up-line>
        <view class="info-item">
            <view class="info-label">国家科技型中小企业认定情况</view>
            <view class="info-value">{{ corporateInfo.nationalTechSME || '-' }}</view>
        </view>
        <view class="info-item">
            <view class="info-label">郑州市科技型企业企业认定情况</view>
            <view class="info-value">{{ corporateInfo.zhengzhouTechEnterprise || '-' }}</view>
        </view>
        <view class="info-item">
            <view class="info-label">高新技术企业认定情况</view>
            <view class="info-value">{{ corporateInfo.highTechEnterprise || '-' }}</view>
        </view>
        <view class="info-item">
            <view class="info-label">专精特新认定情况</view>
            <view class="info-value">{{ corporateInfo.specializedAndSophisticated || '-' }}</view>
        </view>
        <view class="info-item">
            <view class="info-label">研发平台认定情况</view>
            <view class="info-value">{{ corporateInfo.rAndDPlatform || '-' }}</view>
        </view>
        <view class="info-item">
            <view class="info-label">平台名称(如有)</view>
            <view>{{ corporateInfo.platformName || '-' }}</view>
        </view>
        <view class="info-item">
            <view class="info-label">规上企业认定情况</view>
            <view class="info-value">{{ corporateInfo.规上企业 || '-' }}</view>
        </view>
        <view class="info-item">
            <view class="info-label">本年度是否计划入规</view>
            <view class="info-value">{{ corporateInfo.planToBe规上企业 || '-' }}</view>
        </view>
    </view>
    
    <!-- 技术产出 -->
    <view class="info-section">
        <view class="info-title">技术产出</view>
        <up-line></up-line>
        <view class="info-item">
            <view class="info-label">知识产权总数</view>
            <view class="info-value">{{ corporateInfo.totalIntellectualProperty || '-' }}个</view>
        </view>
        <view class="info-item">
            <view class="info-label">发明专利数量</view>
            <view class="info-value">{{ corporateInfo.inventionPatents || '-' }}个</view>
        </view>
        <view class="info-item">
            <view class="info-label">实用新型数量</view>
            <view class="info-value">{{ corporateInfo.utilityModels || '-' }}个</view>
        </view>
        <view class="info-item">
            <view class="info-label">软著数量</view>
            <view class="info-value">{{ corporateInfo.softwareCopyrights || '-' }}个</view>
        </view>
        <view class="info-item">
            <view class="info-label">医疗器械生产许可证</view>
            <view class="info-value">{{ corporateInfo.medicalDeviceProductionLicense || '-' }}个</view>
        </view>
        <view class="info-item">
            <view class="info-label">医疗器械经营许可证</view>
            <view class="info-value">{{ corporateInfo.medicalDeviceBusinessLicense || '-' }}个</view>
        </view>
        <view class="info-item">
            <view class="info-label">其他技术产出(如有)</view>
            <view>{{ corporateInfo.otherTechnicalOutputs || '-' }}</view>
        </view>
       
    </view>
    
    <!-- 政策申报 -->
    <view class="info-section">
        <view class="info-title">政策申报</view>
        <up-line></up-line>
        <view class="info-item">
            <view class="info-label">本月政策获得奖补资金</view>
            <view class="info-value">{{ corporateInfo.monthlyPolicyAwardFund || '-' }}万元</view>
        </view>
        <view class="info-item">
            <view class="info-label">本月政策实际获得奖补资金</view>
            <view class="info-value">{{ corporateInfo.monthlyActualPolicyAwardFund || '-' }}万元</view>
        </view>
    </view>
    <!-- 本月已申报政策 -->
    <view class="info-section">
        <view class="info-title">本月已申报政策</view>
        <up-line></up-line>
        <view v-if="corporateInfo.monthlyDeclaredPolicies && corporateInfo.monthlyDeclaredPolicies.length > 0">
            <view class="info-item" v-for="(policy, index) in corporateInfo.monthlyDeclaredPolicies" :key="index">
                <view class="info-label">{{ policy.name || '政策名称' }}</view>
                <view class="info-value">{{ policy.status || '-' }}</view>
            </view>
        </view>
        <view v-else class="info-item">
            <view class="info-label">无已申报政策</view>
        </view>
    </view>
    <!-- 下月重点申报政策 -->
    <view class="info-section">
        <view class="info-title">下月重点申报政策</view>
        <up-line></up-line>
        <view v-if="corporateInfo.nextMonthKeyPolicies && corporateInfo.nextMonthKeyPolicies.length > 0">
            <view class="info-item" v-for="(policy, index) in corporateInfo.nextMonthKeyPolicies" :key="index">
                <view class="info-label">{{ policy.name || '政策名称' }}</view>
                <view class="info-value">{{ policy.status || '-' }}</view>
            </view>
        </view>
        <view v-else class="info-item">
            <view class="info-label">无重点申报政策</view>
        </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getCorporateInfo } from '@/api/park/park';
import { getCurrentInstance } from 'vue';

const { id } = getCurrentInstance().proxy.$route.query;

// 企业信息数据
const corporateInfo = ref({
  enterpriseName: '',
  createTime: '',
  // 运营情况
  projectInvestmentRecorded: '',
  projectInvestmentRecordedTime: '',
  environmentalAssessmentCompleted: '',
  environmentalAssessmentCompletedTime: '',
  fireApprovalCompleted: '',
  fireApprovalCompletedTime: '',
  safetyAssessmentCompleted: '',
  safetyAssessmentCompletedTime: '',
  occupationalAssessmentCompleted: '',
  occupationalAssessmentCompletedTime: '',
  operationStarted: '',
  operationStartedTime: '',
  enterpriseStatus: '',
  productionStatus: '',
  // 经营情况
  monthlyTotalInvestment: '',
  monthlyEquipmentInvestment: '',
  monthlyFixedAssetInvestment: '',
  monthlyTotalFinancing: '',
  monthlyFund: '',
  monthlyVentureCapital: '',
  monthlyBankFinancing: '',
  monthlyOtherFinancing: '',
  monthlyRAndDExpenditure: '',
  monthlyOperatingIncome: '',
  monthlyContractAmount: '',
  monthlyGrossProfit: '',
  monthlyNetProfit: '',
  monthlyTotalTax: '',
  // 人员信息
  totalEmployees: '',
  maleEmployees: '',
  femaleEmployees: '',
  phdEmployees: '',
  masterEmployees: '',
  bachelorEmployees: '',
  collegeEmployees: '',
  freshGraduates: '',
  partyMembers: '',
  nonPartyMembersUnder28: '',
  actualEmployeesInPark: '',
  actualMaleEmployeesInPark: '',
  actualFemaleEmployeesInPark: '',
  actualPhdEmployeesInPark: '',
  // 资质认证
  nationalTechSME: '',
  zhengzhouTechEnterprise: '',
  highTechEnterprise: '',
  specializedAndSophisticated: '',
  rAndDPlatform: '',
  platformName: '',
 规上企业: '',
  planToBe规上企业: '',
  // 技术产出
  totalIntellectualProperty: '',
  inventionPatents: '',
  utilityModels: '',
  softwareCopyrights: '',
  medicalDeviceProductionLicense: '',
  medicalDeviceBusinessLicense: '',
  otherTechnicalOutputs: '',
  // 政策申报
  monthlyPolicyAwardFund: '',
  monthlyActualPolicyAwardFund: '',
  // 本月已申报政策
  monthlyDeclaredPolicies: [],
  // 下月重点申报政策
  nextMonthKeyPolicies: []
});

// 加载企业信息
const loadCorporateInfo = async () => {
  if (!id) return;
  
  try {
    const res = await getCorporateInfo(id);
    if (res.code === 200 && res.data) {
      corporateInfo.value = {
        ...corporateInfo.value,
        ...res.data
      };
    }
  } catch (error) {
    console.error('获取企业信息失败:', error);
  }
};

onMounted(() => {
  loadCorporateInfo();
});
</script>

<style scoped lang="scss">
.container {
  flex: 1;
  background-color: #f5f5f5;
  min-height: 100vh;
}

   .info-section {
        width: 85%;
        margin: 30rpx auto;
        background-color: #fff;
        border-radius: 20rpx;
        padding: 30rpx;

        .info-title {
            font-size: 28rpx;
            font-weight: bold;
            color: rgba(0, 0, 0, 0.9);
            padding: 0rpx 0rpx 20rpx 0;

        }

        .info-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 30rpx 0;
            color: rgba(0, 0, 0, 0.9);
            font-size: 24rpx;

            .info-label {
                font-size: 24rpx;
                color: rgba(0, 0, 0, 0.6);
            }

            .info-value {
                display: flex;
                align-items: center;
                font-size: 24rpx;
                color: rgba(0, 0, 0, 0.9);
            }
        }


    }


</style>